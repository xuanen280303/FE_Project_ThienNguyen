const notification = (severity, title, message, toast) => {
    const checkSeverity = () => {
        const severityMap = {
            E: 'error',
            S: 'success',
            W: 'warn',
            SC: 'secondary',
            C: 'contrast'
        };
        return severityMap[severity] || 'info';
    };
    toast.add({ severity: checkSeverity(), summary: title, detail: message, life: 3000 });
};

export default notification;
