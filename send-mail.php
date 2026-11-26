<?php
/**
 * Mahalakshmi Spice Heritage Family Restaurant
 * Standalone Secure Gmail SMTP Reservation Mailer (PHP)
 * 
 * Target Email: mshfamilyrestaurant@gmail.com
 * SMTP Host:    smtp.gmail.com:465 (SSL)
 */

// Private server-side error logging (never displayed to public clients)
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

$isCli = (php_sapi_name() === 'cli' && !isset($_SERVER['REQUEST_METHOD']));

if (!$isCli) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=UTF-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
        exit;
    }

    // Enforce expected Content-Type (HTTP 415)
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? trim(strtolower($_SERVER['CONTENT_TYPE'])) : '';
    $isJson = (strpos($contentType, 'application/json') !== false);
    $isForm = (strpos($contentType, 'application/x-www-form-urlencoded') !== false || strpos($contentType, 'multipart/form-data') !== false);

    if (!empty($contentType) && !$isJson && !$isForm) {
        http_response_code(415);
        echo json_encode(['success' => false, 'error' => 'Unsupported Media Type. Expected application/json.']);
        exit;
    }
} else {
    // CLI mode headers
    header('Content-Type: application/json; charset=UTF-8');
}

// Read input: command-line argument first, then php://stdin / php://input or $_POST
$rawInput = '';
if (isset($argv[1])) {
    $rawInput = $argv[1];
} elseif ($isCli) {
    $rawInput = file_get_contents('php://stdin');
} else {
    $rawInput = file_get_contents('php://input');
}

$data = json_decode($rawInput, true);
if (!$data && !empty($_POST)) {
    $data = $_POST;
}

// Extract and validate fields (HTTP 400 Bad Request on invalid input)
$rawName  = isset($data['name']) ? trim($data['name']) : '';
$rawPhone = isset($data['phone']) ? trim($data['phone']) : '';
$rawEmail = isset($data['email']) ? trim($data['email']) : '';
$rawDate  = isset($data['date']) ? trim($data['date']) : '';
$rawTime  = isset($data['time']) ? trim($data['time']) : '';
$rawSeats = isset($data['seats']) ? trim($data['seats']) : (isset($data['guests']) ? trim($data['guests']) : '');

$errors = [];
if (strlen($rawName) < 2) {
    $errors[] = 'Full Name is required (minimum 2 characters).';
}
$phoneDigits = preg_replace('/\D/', '', $rawPhone);
if (strlen($phoneDigits) < 8 || strlen($phoneDigits) > 15) {
    $errors[] = 'A valid contact Phone Number (8-15 digits) is required.';
}
if (!empty($rawEmail) && !filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid Email Address format.';
}
if (empty($rawDate)) {
    $errors[] = 'Reservation Date is required.';
}
if (empty($rawTime)) {
    $errors[] = 'Reservation Time Slot is required.';
}
if (empty($rawSeats)) {
    $errors[] = 'Number of Seats is required.';
}

if (!empty($errors)) {
    if (!$isCli) http_response_code(400);
    echo json_encode([
        'success'          => false,
        'error'            => implode(' ', $errors),
        'validationErrors' => $errors
    ]);
    exit;
}

// Sanitize fields
$name    = htmlspecialchars(substr($rawName, 0, 100));
$phone   = htmlspecialchars(substr($rawPhone, 0, 30));
$email   = !empty($rawEmail) ? htmlspecialchars(substr($rawEmail, 0, 100)) : 'Not Provided';
$date    = htmlspecialchars(substr($rawDate, 0, 20));
$time    = htmlspecialchars(substr($rawTime, 0, 20));
$seats   = htmlspecialchars(substr($rawSeats, 0, 50));
$seating = !empty($data['seating']) ? htmlspecialchars(substr(trim($data['seating']), 0, 50)) : 'Executive Family AC Hall';
$notes   = !empty($data['notes']) ? htmlspecialchars(substr(trim($data['notes']), 0, 500)) : 'None';
$refId      = !empty($data['bookingRef']) ? htmlspecialchars(trim($data['bookingRef'])) : 'MSH-' . mt_rand(100000, 999999);
$paymentId  = !empty($data['paymentId']) ? htmlspecialchars(trim($data['paymentId'])) : '';
$amountPaid = !empty($data['amountPaid']) ? htmlspecialchars(trim($data['amountPaid'])) : '';

// Check for .env file if available
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        list($k, $v) = explode('=', $line, 2);
        $_ENV[trim($k)] = trim(trim($v), '"\'');
    }
}

// SMTP Configuration
$smtpHost  = getenv('SMTP_HOST') ?: (isset($_ENV['SMTP_HOST']) ? $_ENV['SMTP_HOST'] : 'smtp.gmail.com');
$smtpPort  = (int)(getenv('SMTP_PORT') ?: (isset($_ENV['SMTP_PORT']) ? $_ENV['SMTP_PORT'] : 465));
$smtpUser  = getenv('SMTP_USER') ?: (isset($_ENV['SMTP_USER']) ? $_ENV['SMTP_USER'] : 'mshfamilyrestaurant@gmail.com');
$smtpPass  = str_replace(' ', '', getenv('SMTP_PASS') ?: (isset($_ENV['SMTP_PASS']) ? $_ENV['SMTP_PASS'] : ''));
$recipient = getenv('RECIPIENT_EMAIL') ?: (isset($_ENV['RECIPIENT_EMAIL']) ? $_ENV['RECIPIENT_EMAIL'] : 'mshfamilyrestaurant@gmail.com');

if (empty($smtpPass)) {
    error_log("[MSH Reservation Configuration Error] SMTP_PASS is missing in environment variables.");
    if (!$isCli) {
        http_response_code(500);
        echo json_encode([
            'success'    => false,
            'error'      => 'Server configuration error: email service is not configured.',
            'bookingRef' => $refId
        ]);
        exit;
    } else {
        echo json_encode([
            'success'    => false,
            'error'      => 'SMTP_PASS environment variable is not configured.',
            'bookingRef' => $refId
        ]);
        exit;
    }
}

// Format HTML Email Message
$emailTag = !empty($paymentId) ? "[PAID - ₹{$amountPaid}] " : "";
$subject = "=?UTF-8?B?" . base64_encode("{$emailTag}New Table Reservation - {$name} ({$date} at {$time})") . "?=";

$htmlBody = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background-color: #0c0c0d; color: #f4ede4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141416; border: 1px solid #cba158; border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1b1610, #2c2214); padding: 25px 20px; text-align: center; border-bottom: 2px solid #cba158; }
    .header h1 { margin: 0; font-size: 22px; color: #f4ede4; font-family: Georgia, serif; letter-spacing: 2px; text-transform: uppercase; }
    .header p { margin: 6px 0 0; font-size: 11px; color: #cba158; letter-spacing: 1.5px; text-transform: uppercase; }
    .content { padding: 25px 20px; color: #e0deda; font-size: 14px; line-height: 1.6; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 15px; background-color: #1a1a1d; border-radius: 8px; overflow: hidden; }
    .detail-table td { padding: 12px 15px; border-bottom: 1px solid #2b2b2e; font-size: 13px; }
    .detail-table tr:last-child td { border-bottom: none; }
    .label { color: #8e8b86; width: 38%; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .value { color: #f4ede4; font-weight: 500; }
    .action-btn { display: inline-block; background-color: #cba158; color: #0c0c0d; font-weight: bold; padding: 12px 25px; border-radius: 8px; text-decoration: none; margin-top: 20px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
    .footer { background-color: #0e0e10; padding: 15px 20px; text-align: center; font-size: 11px; color: #73706b; border-top: 1px solid #222225; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>Mahalakshmi Spice Heritage</h1>
      <p>Family Restaurant &bull; New Table Reservation</p>
    </div>
    
    <div class='content'>
      <p style='font-size: 16px; margin-top: 0;'>Hello Team,</p>
      <p>A new reservation request has been submitted through the official restaurant website. Here are the booking details:</p>
      
      <table class='detail-table'>
        <tr>
          <td class='label'>Guest Name:</td>
          <td class='value' style='font-size: 15px; font-weight: bold;'>{$name}</td>
        </tr>
        <tr>
          <td class='label'>Phone Number:</td>
          <td class='value'><a href='tel:{$phone}' style='color: #cba158; text-decoration: none; font-weight: bold;'>{$phone}</a></td>
        </tr>
        <tr>
          <td class='label'>Email Address:</td>
          <td class='value'><a href='mailto:{$email}' style='color: #cba158; text-decoration: none;'>{$email}</a></td>
        </tr>
        <tr>
          <td class='label'>Reservation Date:</td>
          <td class='value' style='font-weight: bold;'>{$date}</td>
        </tr>
        <tr>
          <td class='label'>Time Slot:</td>
          <td class='value' style='font-weight: bold;'>{$time}</td>
        </tr>
        <tr>
          <td class='label'>Party Size / Seats:</td>
          <td class='value' style='color: #cba158; font-weight: bold;'>{$seats}</td>
        </tr>
        <tr>
          <td class='label'>Seating Area:</td>
          <td class='value'>{$seating}</td>
        </tr>
        <tr>
          <td class='label'>Special Requests:</td>
          <td class='value' style='font-style: italic;'>{$notes}</td>
        </tr>
        <tr>
          <td class='label'>Booking Ref:</td>
          <td class='value' style='font-family: monospace; color: #cba158; font-weight: bold;'>#{$refId}</td>
        </tr>" . (!empty($paymentId) ? "
        <tr>
          <td class='label'>Payment Status:</td>
          <td class='value' style='color: #10b981; font-weight: bold;'>PAID &bull; Verified via Razorpay</td>
        </tr>
        <tr>
          <td class='label'>Razorpay Payment ID:</td>
          <td class='value' style='font-family: monospace; color: #cba158; font-weight: bold;'>{$paymentId}</td>
        </tr>
        <tr>
          <td class='label'>Amount Paid:</td>
          <td class='value' style='font-weight: bold; color: #f4ede4;'>₹{$amountPaid}</td>
        </tr>" : "") . "
        <tr>
          <td class='label'>Received At:</td>
          <td class='value'>" . date('Y-m-d H:i:s T') . "</td>
        </tr>
      </table>

      <div style='text-align: center;'>
        <a href='tel:{$phone}' class='action-btn'>Call Guest: {$phone}</a>
      </div>
    </div>

    <div class='footer'>
      Mahalakshmi Spice Heritage Family Restaurant Automated Dispatcher<br>
      Notification delivered to {$recipient}
    </div>
  </div>
</body>
</html>
";

/**
 * Pure PHP SMTP Function using direct SSL Socket connection
 */
function sendSmtpEmail($host, $port, $user, $pass, $from, $to, $subject, $htmlBody) {
    $timeout = 15;
    $socket = @fsockopen("ssl://{$host}", $port, $errno, $errstr, $timeout);
    
    if (!$socket) {
        error_log("[MSH Reservation Socket Error] Failed to connect to {$host}:{$port} - {$errstr} ({$errno})");
        return ['success' => false, 'error' => "Socket connection failed: {$errstr} ({$errno})"];
    }

    // Set stream read/write timeout to 15 seconds
    stream_set_timeout($socket, $timeout);

    $readResponse = function() use ($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        $info = stream_get_meta_data($socket);
        if (!empty($info['timed_out'])) {
            throw new Exception("SMTP read stream timed out after 15 seconds.");
        }
        return $response;
    };

    $sendCommand = function($cmd, $expectedCode) use ($socket, $readResponse) {
        fputs($socket, $cmd . "\r\n");
        $res = $readResponse();
        $code = substr($res, 0, 3);
        if ($code != $expectedCode) {
            throw new Exception("SMTP Command failed: [{$cmd}] - Server response: {$res}");
        }
        return $res;
    };

    try {
        $greeting = $readResponse();
        if (substr($greeting, 0, 3) != '220') {
            throw new Exception("Unexpected SMTP Greeting: {$greeting}");
        }

        $sendCommand("EHLO localhost", 250);
        $sendCommand("AUTH LOGIN", 334);
        $sendCommand(base64_encode($user), 334);
        $sendCommand(base64_encode($pass), 235);
        $sendCommand("MAIL FROM:<{$from}>", 250);
        $sendCommand("RCPT TO:<{$to}>", 250);
        $sendCommand("DATA", 354);

        // MIME Headers
        $headers  = "From: Mahalakshmi Spice Heritage <{$from}>\r\n";
        $headers .= "Reply-To: <{$from}>\r\n";
        $headers .= "To: <{$to}>\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $headers .= "X-Mailer: PHP/Mahalakshmi-Restaurant\r\n";

        $bodyEncoded = chunk_split(base64_encode($htmlBody));

        fputs($socket, $headers . "\r\n" . $bodyEncoded . "\r\n.\r\n");
        $dataRes = $readResponse();
        if (substr($dataRes, 0, 3) != '250') {
            throw new Exception("Data delivery failed: {$dataRes}");
        }

        $sendCommand("QUIT", 221);
        fclose($socket);

        return ['success' => true];
    } catch (Exception $e) {
        if (is_resource($socket)) {
            fclose($socket);
        }
        error_log("[MSH Reservation Error] " . $e->getMessage());
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Execute Send
$result = sendSmtpEmail($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpUser, $recipient, $subject, $htmlBody);

if ($result['success']) {
    if (!$isCli) http_response_code(200);
    echo json_encode([
        'success'    => true,
        'message'    => "Reservation notification delivered to {$recipient} successfully.",
        'bookingRef' => $refId
    ]);
} else {
    if (!$isCli) {
        http_response_code(500);
        error_log("[MSH Reservation Failure] BookingRef: {$refId} - Error: " . $result['error']);
        echo json_encode([
            'success'    => false,
            'error'      => 'Unable to complete reservation dispatch at this moment. Please contact restaurant directly at +91 91482 78837.',
            'bookingRef' => $refId
        ]);
    } else {
        echo json_encode([
            'success'    => false,
            'error'      => $result['error'],
            'bookingRef' => $refId
        ]);
    }
}
