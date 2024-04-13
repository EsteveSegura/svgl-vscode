const { loadLanguage } = require('../../../src/services/languageService'); // Adjust the path as necessary
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

const { DEFAULT_LANGUAGE } = require('../../../src/constants');

jest.mock('vscode', () => ({
    env: {
        language: 'en'
    },
    window: {
        showErrorMessage: jest.fn()
    }
}), { virtual: true });

jest.mock('path', () => ({
    join: jest.fn()
}), { virtual: true });

jest.mock('fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}), { virtual: true });

describe('loadLanguage', () => {
    it('should load the language file based on the locale', () => {
        const mockData = JSON.stringify({ greeting: "Hello" });
        path.join.mockReturnValue('path/to/en.json');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockData);

        const result = loadLanguage();

        expect(result).toEqual({ greeting: "Hello" });
        expect(path.join).toHaveBeenCalledWith(expect.anything(), '..', '..', '..', 'languages', 'en.json');
        expect(fs.readFileSync).toHaveBeenCalledWith('path/to/en.json', 'utf8');
    });

    it('should load the default language file when locale file does not exist', () => {
        path.join.mockImplementation((...args) => args.join('/'));
        fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);
        const mockDefaultData = JSON.stringify({ greeting: "Hello, default" });
        fs.readFileSync.mockReturnValue(mockDefaultData);

        const result = loadLanguage();

        expect(result).toEqual({ greeting: "Hello, default" });
        expect(path.join).toHaveBeenCalledWith(expect.anything(), '..', '..', '..', 'languages', `${DEFAULT_LANGUAGE}.json`);
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(`${DEFAULT_LANGUAGE}.json`), 'utf8');
    });

    it('should return an empty object and show an error message if reading the file fails', () => {
        const error = new Error('Error reading file');
        path.join.mockReturnValue('path/to/en.json');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockImplementation(() => { throw error; });

        const result = loadLanguage();

        expect(result).toEqual({});
        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(`Error loading language file: ${error}`);
    });
});
