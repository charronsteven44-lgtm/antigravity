<?php
header('Content-Type: application/json');

// --- CONFIGURATION ---
$apiKey = getenv('SENDGRID_API_KEY');
if (!$apiKey) {
    // Si la variable d'env n'est pas définie, on peut la durcir ici ou utiliser un fichier .env
    $apiKey = 'VOTRE_CLE_SENDGRID_ICI'; 
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'No input data']);
    exit;
}

$email = $input['email'];
$name = $input['name'];
$responses = $input['responses'];

// --- GENERATION DU PROGRAMME (Logique simplifiée miroir du JS) ---
$goal = $responses[5] ?? 'forme';
$level = $responses[4] ?? 'débutant';
$title = "Programme ESSOR - " . $goal;

$details = "<h3>🏃 $title</h3><p>Bonjour $name, voici ton programme...</p>"; 

// --- ENVOI VIA SENDGRID API ---
$data = [
    'personalizations' => [[
        'to' => [['email' => $email]]
    ]],
    'from' => ['email' => 'contact@essor-active.com'],
    'subject' => "🔥 Ton Programme : " . $title,
    'content' => [[
        'type' => 'text/html',
        'value' => "<html><body>$details<br><a href='https://essor-active.com/dashboard'>Voir mon Dashboard</a></body></html>"
    ]]
];

$ch = curl_init('https://api.sendgrid.com/v3/mail/send');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error sending email', 'details' => $response]);
}
?>
