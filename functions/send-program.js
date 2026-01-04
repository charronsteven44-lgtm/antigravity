const sgMail = require('@sendgrid/mail');

// Workout Generator Logic (Mirrored from server.js for cloud execution)
function generateWorkout(responses) {
    const goal = responses[5] || 'forme';
    const level = responses[4] || 'débutant';
    const frequencyStr = responses[7] || '3x / semaine';

    let frequency = 3;
    if (frequencyStr.includes('2x')) frequency = 2;
    if (frequencyStr.includes('4x')) frequency = 4;
    if (frequencyStr.includes('Tous les jours')) frequency = 7;

    let title = "Programme ESSOR - ";
    if (goal.includes('poids')) title += "Perte de Poids";
    else if (goal.includes('muscle')) title += "Prise de Muscle";
    else if (goal.includes('douleurs')) title += "Mobilité & Santé";
    else if (goal.includes('Performance')) title += "Performance Athlétique";
    else title += "Remise en Forme";

    title += (level.includes('Avancé') ? " (Avancé)" : " (Initial)");

    let schedule = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    for (let i = 0; i < 7; i++) {
        let activity = "Repos / Récupération Active";
        const isTrainingDay = (frequency === 2 && (i === 1 || i === 4)) ||
            (frequency === 3 && (i === 0 || i === 2 || i === 4)) ||
            (frequency === 4 && (i === 0 || i === i === 1 || i === 3 || i === 4)) ||
            (frequency === 7);

        if (isTrainingDay) {
            activity = `Séance : ${goal} (${responses[6] || '30 min'})`;
        }

        schedule.push({ day: days[i], activity: activity });
    }

    const details = `
        <h3 style="color: #49e619;">🏃 ${title}</h3>
        <p>Objectif: ${goal} | Niveau: ${level}</p>
        <ul style="line-height: 1.6;">
            ${schedule.map(s => `<li><strong>${s.day}:</strong> ${s.activity}</li>`).join('')}
        </ul>
        <p><em>"La régularité est la clé du succès. On lâche rien !"</em></p>
    `;

    return { title, details };
}

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email, name, responses } = JSON.parse(event.body);

        if (!process.env.SENDGRID_API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: 'SendGrid API Key missing' }) };
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const program = generateWorkout(responses);
        const dashboardLink = "https://essor-active.com/dashboard.html";

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL || 'contact@essor-active.com',
            subject: `🔥 Ton Programme : ${program.title}`,
            html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #49e619; text-align: center;">${program.title}</h1>
                        <p>Bonjour ${name},</p>
                        <p>Ton coach virtuel a analysé tes réponses. Voici ton plan d'action :</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #49e619; margin: 20px 0;">
                            ${program.details}
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${dashboardLink}" style="background-color: #49e619; color: black; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Voir mon Dashboard</a>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await sgMail.send(msg);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('Netlify Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
