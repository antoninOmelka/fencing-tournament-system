export async function getResults() {
    try {
        const response = await fetch("api/results");
        const data = await response.json();
        return data.participants;
    } catch (error) {
        console.error(error);
        return [];
    }
}