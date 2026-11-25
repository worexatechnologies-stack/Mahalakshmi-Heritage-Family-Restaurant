<?php
/**
 * Mahalakshmi Spice Heritage - Mail Dispatcher Backend
 * 
 * Handles incoming POST requests (JSON or form data) from the reservation and contact forms,
 * validates inputs, composes branded HTML emails, and dispatches them via SMTP or PHP mail().
 */

// Load Configuration
$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath) ? require $configPath : [];

$recipientEmail = $config['recipient_email'] ?? 'mshfamilyrestaurant@gmail.com';
$recipientName  = $config['recipient_name']  ?? 'Mahalakshmi Spice Heritage Reservations';
$senderEmail    = $config['sender_email']    ?? 'noreply@mahalakshmispiceheritage.com';
$senderName     = $config['sender_name']     ?? 'Mahalakshmi Spice Heritage';
$smtpConfig     = $config['smtp']            ?? ['enabled' => false];
$sendCustomerAck= $config['send_customer_confirmation'] ?? true;

// CLI vs HTTP handling
$isCli = (php_sapi_name() === 'cli');

if (!$isCli) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        echo json_encode(['status' => 'ok', 'message' => 'CORS preflight successful']);
        exit;
    }

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed. Please use POST.']);
        exit;
    }
}

// Read raw input (JSON or form data)
$rawInput = file_get_contents('php://input');
if ($isCli && empty($rawInput)) {
    $rawInput = file_get_contents('php://stdin');
}
$payload = json_decode($rawInput, true);

if (!is_array($payload) || empty($payload)) {
    $payload = !empty($_POST) ? $_POST : [];
}

// Determine request type
$type = isset($payload['type']) ? strtolower(trim($payload['type'])) : 'reservation';

/**
 * Clean & sanitize text input
 */
function clean($str) {
    if (!is_string($str)) return '';
    return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
}

/**
 * Socket-based SMTP mail client with TLS & AUTH LOGIN support
 */
function sendViaSmtp($to, $subject, $htmlBody, $plainBody, $replyTo, $smtp, $fromEmail, $fromName) {
    $host = $smtp['host'] ?? 'smtp.gmail.com';
    $port = (int)($smtp['port'] ?? 465);
    $secure = strtolower($smtp['secure'] ?? 'ssl');
    $user = trim($smtp['username'] ?? '');
    $pass = str_replace(' ', '', trim($smtp['password'] ?? ''));
    $timeout = (int)($smtp['timeout'] ?? 15);

    $socketHost = ($secure === 'ssl' || $port === 465) ? "ssl://{$host}:{$port}" : "tcp://{$host}:{$port}";
    
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $socket = @stream_socket_client($socketHost, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);

    if (!$socket) {
        throw new Exception("Could not connect to SMTP server ({$socketHost}): {$errstr} ({$errno})");
    }

    $readResponse = function() use ($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $response;
    };

    $sendCommand = function($cmd, $expectedCode = 250) use ($socket, $readResponse) {
        fputs($socket, $cmd . "\r\n");
        $resp = $readResponse();
        $code = (int)substr($resp, 0, 3);
        if ($expectedCode && $code !== $expectedCode) {
            throw new Exception("SMTP Error: Command '{$cmd}' gave code {$code}. Response: {$resp}");
        }
        return $resp;
    };

    $readResponse(); // Read initial server banner

    $clientName = gethostname() ?: 'localhost';
    $sendCommand("EHLO {$clientName}");

    if ($secure === 'tls' && $port !== 465) {
        $sendCommand("STARTTLS", 220);
        $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
        }
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
            $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
        }
        if (!stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
            throw new Exception("Failed to establish TLS encryption with SMTP server.");
        }
        $sendCommand("EHLO {$clientName}");
    }

    if (!empty($user) && !empty($pass)) {
        $sendCommand("AUTH LOGIN", 334);
        $sendCommand(base64_encode($user), 334);
        $sendCommand(base64_encode($pass), 235);
    }

    $fromAddress = !empty($user) ? $user : $fromEmail;
    $sendCommand("MAIL FROM:<{$fromAddress}>");
    $sendCommand("RCPT TO:<{$to}>");
    $sendCommand("DATA", 354);

    $boundary = "====_MSH_BOUNDARY_" . md5(uniqid(microtime(true), true)) . "_====";

    $headers = [];
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromAddress}>";
    $headers[] = "To: <{$to}>";
    if (!empty($replyTo)) {
        $headers[] = "Reply-To: <{$replyTo}>";
    }
    $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers[] = "Date: " . date('r');
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    $headers[] = "X-Mailer: MSH PHP Mailer";

    $messageBody  = implode("\r\n", $headers) . "\r\n\r\n";
    $messageBody .= "--{$boundary}\r\n";
    $messageBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $messageBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $messageBody .= chunk_split(base64_encode($plainBody)) . "\r\n";
    $messageBody .= "--{$boundary}\r\n";
    $messageBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $messageBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $messageBody .= chunk_split(base64_encode($htmlBody)) . "\r\n";
    $messageBody .= "--{$boundary}--\r\n";
    $messageBody .= "\r\n.\r\n";

    fputs($socket, $messageBody);
    $dataResp = $readResponse();
    if ((int)substr($dataResp, 0, 3) !== 250) {
        throw new Exception("SMTP DATA rejected: {$dataResp}");
    }

    $sendCommand("QUIT", 221);
    fclose($socket);
    return true;
}

/**
 * High-level mail dispatcher (routes to SMTP or native mail() with local audit logging)
 */
function sendMail($to, $subject, $htmlContent, $plainContent, $replyTo = '', $config = []) {
    $smtp = $config['smtp'] ?? ['enabled' => false];
    $fromEmail = $config['sender_email'] ?? 'noreply@mahalakshmispiceheritage.com';
    $fromName  = $config['sender_name']  ?? 'Mahalakshmi Spice Heritage';

    // Store local audit copy in backend/mail_logs
    $logDir = __DIR__ . '/mail_logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0777, true);
    }
    $logFile = $logDir . '/mail_' . date('Ymd_His') . '_' . substr(md5(uniqid(mt_rand(), true)), 0, 6) . '.html';
    $logContent = "<!-- TO: {$to} | SUBJECT: {$subject} | DATE: " . date('r') . " -->\n" . $htmlContent;
    @file_put_contents($logFile, $logContent);

    // 1. If SMTP is enabled, use authenticated SMTP
    if (!empty($smtp['enabled']) && !empty($smtp['host'])) {
        return sendViaSmtp($to, $subject, $htmlContent, $plainContent, $replyTo, $smtp, $fromEmail, $fromName);
    }

    // 2. Native PHP mail() with proper MIME headers
    $boundary = "====_MSH_" . md5(uniqid(microtime(true), true)) . "_====";

    $headers = [];
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
    if (!empty($replyTo)) {
        $headers[] = "Reply-To: <{$replyTo}>";
    }
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    $headers[] = "X-Mailer: PHP/" . phpversion();

    $body  = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($plainContent)) . "\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($htmlContent)) . "\r\n";
    $body .= "--{$boundary}--\r\n";

    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

    if (!$sent) {
        $lastError = error_get_last();
        $errMsg = $lastError['message'] ?? '';
        
        // If on local Windows environment with no localhost mail server running, fallback to audit log safely
        if (stripos($errMsg, 'Failed to connect to mailserver') !== false || stripos($errMsg, 'mailserver at') !== false) {
            return [
                'status' => 'logged_locally',
                'file' => basename($logFile),
                'notice' => 'Email saved in local log. To send live emails from localhost, enable SMTP in backend/config.php.'
            ];
        }
        throw new Exception($errMsg ?: 'PHP mail() function failed.');
    }
    return true;
}

// -------------------------------------------------------------
// PROCESS FORMS
// -------------------------------------------------------------

try {
    if ($type === 'newsletter') {
        // Newsletter Subscription
        $email = filter_var($payload['email'] ?? '', FILTER_VALIDATE_EMAIL);
        if (!$email) {
            throw new Exception("Please provide a valid email address.");
        }

        $subject = "New Newsletter Subscription: " . $email;
        $html = "
        <div style='background-color:#141416;padding:24px;color:#f4ede4;font-family:Arial,sans-serif;'>
            <div style='max-width:500px;margin:auto;background:#1e1e22;padding:20px;border-radius:12px;border:1px solid #cba158;'>
                <h3 style='color:#cba158;margin-top:0;'>New Newsletter Subscriber</h3>
                <p>A visitor has subscribed to receive updates and banquet offers:</p>
                <p style='font-size:16px;font-weight:bold;color:#ffffff;'>Email: <a href='mailto:{$email}' style='color:#cba158;'>{$email}</a></p>
                <p style='font-size:12px;color:#999;margin-top:20px;'>Submitted on " . date('d M Y, h:i A') . " IST</p>
            </div>
        </div>";

        $plain = "New Newsletter Subscriber: {$email}\nDate: " . date('d M Y, h:i A');

        sendMail($recipientEmail, $subject, $html, $plain, $email, $config);

        echo json_encode([
            'success' => true,
            'message' => 'Thank you for subscribing to Mahalakshmi Spice Heritage updates!'
        ]);
        exit;
    }

    // Default: Table Reservation & Banquet Enquiry
    $name    = clean($payload['name'] ?? '');
    $phone   = clean($payload['phone'] ?? '');
    $email   = clean($payload['email'] ?? '');
    $date    = clean($payload['date'] ?? date('Y-m-d'));
    $time    = clean($payload['time'] ?? '19:30');
    $guests  = clean($payload['guests'] ?? '4 Guests');
    $seating = clean($payload['seating'] ?? 'Main Family Dining Hall');
    $notes   = clean($payload['notes'] ?? 'None');

    if (empty($name)) {
        throw new Exception("Full Name is required.");
    }
    if (empty($phone)) {
        throw new Exception("Phone Number is required.");
    }

    $reservationId = "MSH-" . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
    $timestamp = date('d M Y, h:i A') . " IST";

    // 1. Email to Restaurant Management (RESTAURANT OWNER ONLY)
    $adminSubject = "🔔 NEW RESERVATION ALERT: #{$reservationId} - {$name} ({$guests})";

    $adminHtml = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='margin:0;padding:0;background-color:#0c0c0d;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>
        <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#0c0c0d;padding:30px 10px;'>
            <tr>
                <td align='center'>
                    <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;background-color:#141416;border:1px solid #2e2e32;border-radius:16px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.6);'>
                        
                        <!-- Admin Alert Header -->
                        <tr>
                            <td style='background:linear-gradient(135deg, #221c13 0%, #141416 100%);padding:28px 30px;border-bottom:2px solid #cba158;text-align:center;'>
                                <div style='font-size:11px;letter-spacing:3px;color:#cba158;text-transform:uppercase;font-weight:700;'>
                                    RESTAURANT OWNER / MANAGEMENT ALERT
                                </div>
                                <h1 style='color:#f4ede4;font-size:24px;margin:6px 0 0;font-family:Georgia,serif;'>Mahalakshmi Spice Heritage</h1>
                                <div style='display:inline-block;margin-top:12px;background:#cba158;color:#0c0c0d;font-size:12px;font-weight:700;padding:5px 16px;border-radius:20px;letter-spacing:1px;'>
                                    NEW BOOKING: #{$reservationId}
                                </div>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td style='padding:28px 30px;color:#f4ede4;'>
                                <p style='font-size:15px;line-height:1.6;color:#d5cfc7;margin:0 0 20px;'>
                                    A customer has just submitted a new table reservation on your website. Please review the booking details below:
                                </p>

                                <table width='100%' cellpadding='10' cellspacing='0' style='border-collapse:collapse;background-color:#1c1c20;border-radius:10px;overflow:hidden;border:1px solid #2b2b30;'>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td width='35%' style='color:#99938a;font-size:13px;font-weight:600;'>Guest Name:</td>
                                        <td style='color:#ffffff;font-size:15px;font-weight:700;'>{$name}</td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Phone Number:</td>
                                        <td style='color:#ffffff;font-size:15px;font-weight:700;'>
                                            <a href='tel:{$phone}' style='color:#cba158;text-decoration:none;'>{$phone}</a>
                                        </td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Customer Email:</td>
                                        <td style='color:#ffffff;font-size:14px;'>
                                            " . (!empty($email) ? "<a href='mailto:{$email}' style='color:#cba158;text-decoration:none;'>{$email}</a>" : "<span style='color:#777;'>Not provided</span>") . "
                                        </td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Date of Visit:</td>
                                        <td style='color:#ffffff;font-size:14px;font-weight:700;'>{$date}</td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Time Slot:</td>
                                        <td style='color:#ffffff;font-size:14px;font-weight:700;'>{$time}</td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Party Size:</td>
                                        <td style='color:#cba158;font-size:15px;font-weight:700;'>{$guests}</td>
                                    </tr>
                                    <tr style='border-bottom:1px solid #28282d;'>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;'>Seating Area:</td>
                                        <td style='color:#ffffff;font-size:14px;'>{$seating}</td>
                                    </tr>
                                    <tr>
                                        <td style='color:#99938a;font-size:13px;font-weight:600;vertical-align:top;'>Special Requests:</td>
                                        <td style='color:#e2dcd2;font-size:13px;line-height:1.5;'>{$notes}</td>
                                    </tr>
                                </table>

                                <!-- Quick Call Action for Restaurant Owner -->
                                <div style='text-align:center;margin-top:28px;'>
                                    <a href='tel:{$phone}' style='display:inline-block;background-color:#cba158;color:#0c0c0d;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:8px;box-shadow:0 4px 15px rgba(203,161,88,0.3);'>
                                        📞 Call Customer Now ({$phone})
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer Info -->
                        <tr>
                            <td style='background-color:#0f0f11;padding:18px 30px;border-top:1px solid #232327;text-align:center;color:#7e7870;font-size:11px;'>
                                Sent to Restaurant Management &bull; Mahalakshmi Spice Heritage Website &bull; {$timestamp}
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>";

    $adminPlain = "RESTAURANT OWNER RESERVATION ALERT\n"
                . "Reservation ID: #{$reservationId}\n"
                . "Guest Name: {$name}\n"
                . "Phone: {$phone}\n"
                . "Email: {$email}\n"
                . "Date: {$date}\n"
                . "Time: {$time}\n"
                . "Party Size: {$guests}\n"
                . "Seating Area: {$seating}\n"
                . "Special Requests: {$notes}\n"
                . "Submitted: {$timestamp}\n";

    // Send email to restaurant manager
    $replyTo = !empty($email) ? $email : '';
    sendMail($recipientEmail, $adminSubject, $adminHtml, $adminPlain, $replyTo, $config);

    // 2. Customer Confirmation Receipt (Sent ONLY to the Customer, NEVER to the restaurant owner)
    $isOwnerEmail = (strtolower(trim($email)) === strtolower(trim($recipientEmail)));

    if ($sendCustomerAck && !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL) && !$isOwnerEmail) {
        $custSubject = "Reservation Confirmed (#{$reservationId}) - Mahalakshmi Spice Heritage";
        $custHtml = "
        <!DOCTYPE html>
        <html>
        <head><meta charset='UTF-8'></head>
        <body style='margin:0;padding:0;background-color:#0c0c0d;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>
            <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#0c0c0d;padding:30px 10px;'>
                <tr>
                    <td align='center'>
                        <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;background-color:#141416;border:1px solid #2e2e32;border-radius:16px;overflow:hidden;'>
                            <tr>
                                <td style='background:linear-gradient(135deg, #1f1b14 0%, #141416 100%);padding:28px 30px;border-bottom:2px solid #cba158;text-align:center;'>
                                    <div style='font-size:11px;letter-spacing:3px;color:#cba158;text-transform:uppercase;font-weight:700;'>Royal Indian Dining</div>
                                    <h1 style='color:#f4ede4;font-size:24px;margin:6px 0 0;font-family:Georgia,serif;'>Mahalakshmi Spice Heritage</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style='padding:28px 30px;color:#f4ede4;'>
                                    <h2 style='color:#cba158;font-size:20px;margin-top:0;font-family:Georgia,serif;'>Namaste, {$name}!</h2>
                                    <p style='color:#d5cfc7;font-size:14px;line-height:1.6;'>
                                        Thank you for booking with us. We have received your reservation request and look forward to welcoming you and your family for an authentic royal dining experience.
                                    </p>

                                    <div style='background-color:#1c1c20;border:1px solid #2b2b30;border-radius:10px;padding:18px;margin:20px 0;'>
                                        <div style='font-size:12px;color:#cba158;font-weight:700;margin-bottom:8px;'>RESERVATION SUMMARY</div>
                                        <div style='font-size:13px;color:#fff;margin:4px 0;'><strong>Reservation ID:</strong> #{$reservationId}</div>
                                        <div style='font-size:13px;color:#fff;margin:4px 0;'><strong>Date & Time:</strong> {$date} at {$time}</div>
                                        <div style='font-size:13px;color:#fff;margin:4px 0;'><strong>Party Size:</strong> {$guests}</div>
                                        <div style='font-size:13px;color:#fff;margin:4px 0;'><strong>Seating:</strong> {$seating}</div>
                                    </div>

                                    <p style='font-size:13px;color:#99938a;line-height:1.5;'>
                                        Need to modify your booking or have questions? Feel free to call us directly at 
                                        <a href='tel:+919148278837' style='color:#cba158;font-weight:700;'>+91 91482 78837</a>.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style='background-color:#0f0f11;padding:16px 30px;border-top:1px solid #232327;text-align:center;color:#7e7870;font-size:11px;'>
                                    Mahalakshmi Spice Heritage Family Restaurant &bull; Authentic Royal Indian Dining
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>";

        $custPlain = "Namaste {$name},\n\nThank you for choosing Mahalakshmi Spice Heritage!\nReservation ID: #{$reservationId}\nDate: {$date} at {$time}\nParty Size: {$guests}\nSeating: {$seating}\n\nCall us: +91 91482 78837";

        try {
            sendMail($email, $custSubject, $custHtml, $custPlain, $recipientEmail, $config);
        } catch (Exception $e) {
            // Customer copy non-critical, proceed
        }
    }

    echo json_encode([
        'success' => true,
        'message' => "Table reserved successfully for {$name}!",
        'reservationId' => "#{$reservationId}",
        'data' => [
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'date' => $date,
            'time' => $time,
            'guests' => $guests,
            'seating' => $seating,
            'notes' => $notes,
            'timestamp' => $timestamp
        ]
    ]);

} catch (Exception $ex) {
    if (!$isCli) {
        http_response_code(400);
    }
    echo json_encode([
        'success' => false,
        'error' => $ex->getMessage()
    ]);
}
