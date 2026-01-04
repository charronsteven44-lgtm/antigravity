require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('--- TEST CONFIGURATION SENDGRID ---');
const key = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (!key) {
    console.error('❌ ERREUR: Clé API manquante dans le fichier .env');
    process.exit(1);
}
if (!fromEmail) {
    console.error('❌ ERREUR: Email expéditeur manquant dans le fichier .env');
    process.exit(1);
}

console.log(`✅ Clé API détectée (Commence par: ${key.substring(0, 5)}...)`);
console.log(`✅ Email expéditeur: ${fromEmail}`);

sgMail.setApiKey(key);

const msg = {
    to: fromEmail, // Envoi à soi-même pour tester
    from: fromEmail,
    subject: 'Test Technique ESSOR ACTIVE',
    text: 'Ceci est un email de test pour vérifier que la configuration SendGrid fonctionne.',
    html: '<strong>Ceci est un email de test</strong> pour vérifier que la configuration SendGrid fonctionne.',
};

console.log('\n--- TENTATIVE D\'ENVOI ---');
console.log(`Envoi de ${fromEmail} vers ${fromEmail}...`);

sgMail
    .send(msg)
    .then((response) => {
        console.log('\n✅ SUCCÈS ! Email envoyé.');
        console.log(`Status Code: ${response[0].statusCode}`);
        console.log('Vérifiez votre boîte mail (et les spams).');
    })
    .catch((error) => {
        console.error('\n❌ ÉCHEC DE L\'ENVOI');
        console.error(error.toString());
        if (error.response) {
            console.error('Détails SendGrid:');
            console.error(JSON.stringify(error.response.body, null, 2));
        }
    });
