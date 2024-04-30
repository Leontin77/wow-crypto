import axios from 'axios';

const generateAvatar = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        const data = response.data;
        const randomIndex = Math.floor(Math.random() * data.length);
        const cryptoId = data[randomIndex].id;
        const responseDetails = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
        const imageUrl = responseDetails.data.image.large;
        return imageUrl;
    } catch (error) {
        console.error('Create avatar error', error);
        return null;
    }
}

export default generateAvatar;
