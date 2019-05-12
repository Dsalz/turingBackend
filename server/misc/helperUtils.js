import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';

dotenv.config();

export default {
  paginateData: (data, page = 1, limit) => {
    limit = limit || data.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return data.slice(startIndex, endIndex);
  },
  sendMail: (data) => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const { email, from, subject, text } = data;
    const message = {
      to: email,
      from,
      subject,
      text,
    };
    return sendGrid.send(message).catch(() => {});
  }
};
