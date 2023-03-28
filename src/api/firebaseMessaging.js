

export default function sendMessage(){
    return new Promise((resolve, reject) => {
        fetch(import.meta.env.VITE_APP_API_BASE_URL + '/assigned-device', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {

                if (data.type !== 'success') {

                    reject({
                        type: data.type,
                        message: data.message ? data.message : 'Failed to send monitoring data to API!'
                    });

                    return false;
                }

                resolve(data);
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    })
}