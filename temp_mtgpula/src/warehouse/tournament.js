import { Service } from "./auth";

const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // Debug line
    
    return {
        headers: {
            Authorization: `Bearer ${token}`
            
        }
    };
};

const tournament = {
    async createTournament(data) {
        try {
            const config = getAuthConfig();
            console.log('Request config:', config); // Debug line
            
            const response = await Service.post('/tournaments/create', data, config);
            return response.data;
        } catch (error) {
            console.error('Tournament creation error:', error.response?.data || error);
            throw error;
        }
    }
};

export { tournament };