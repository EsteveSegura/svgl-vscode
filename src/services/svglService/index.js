async function fetchSVGs(query) {
    const response = await fetch(`https://svgl.app/api/svgs?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('SVGL service is down');
    }
    return response.json();
}

async function fetchSVGContent(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch SVG content');
    }
    return response.text();
}

module.exports = {
    fetchSVGs,
    fetchSVGContent
};