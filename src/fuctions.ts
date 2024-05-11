export default function convertKbToMb(sizeInKb: string): string {
    const kb = parseFloat(sizeInKb);
    const mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
}
import schedule from 'node-schedule';

export  function runEvery24Hours(callback: () => void) {
    // Schedule the callback to run every day at the same time
    const job = schedule.scheduleJob('0 0 * * *', callback);

    // Log a message when the job is scheduled
    console.log('Job scheduled to run every 24 hours.');

    // Return the job in case you want to cancel it later
    return job;
}
