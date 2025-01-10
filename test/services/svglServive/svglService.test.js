const { fetchSVGs, fetchSVGContent } = require('../../../src/services/svglService'); // Adjust the path as necessary

describe('SVG Service', () => {
    describe('fetchSVGs', () => {
        it('should fetch SVGs successfully', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: 'some SVG data' })
                })
            );

            const result = await fetchSVGs('test');

            expect(result).toEqual({ data: 'some SVG data' });
            expect(fetch).toHaveBeenCalledWith('https://api.svgl.app?search=test');
        });

        it('should throw an error when the service is down', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );

            await expect(fetchSVGs('test')).rejects.toThrow('SVGL service is down');
        });
    });

    describe('fetchSVGContent', () => {
        it('should fetch SVG content successfully', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('<svg>content</svg>')
                })
            );

            const result = await fetchSVGContent('http://example.com/test.svg');

            expect(result).toBe('<svg>content</svg>');
            expect(fetch).toHaveBeenCalledWith('http://example.com/test.svg');
        });

        it('should throw an error when it fails to fetch SVG content', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                })
            );

            await expect(fetchSVGContent('http://example.com/test.svg')).rejects.toThrow('Failed to fetch SVG content');
        });
    });
});
