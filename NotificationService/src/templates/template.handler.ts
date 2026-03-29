import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars'; 

export async function renderTemplate(templateId: string, params: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, 'mailer', `${templateId}.hbs`);
    
    try{
         const templateContent = await fs.readFile(templatePath, 'utf-8');
         const finalContent = Handlebars.compile(templateContent)(params);
         return finalContent;
    }catch(error){
         console.error(`Error reading template file at ${templatePath}:`, error);
         throw new Error(`Template ${templateId} not found`);
    }
}

