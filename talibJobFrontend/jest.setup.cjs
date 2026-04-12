// jest.setup.cjs
require('@testing-library/jest-dom'); // Cette ligne active "toBeInTheDocument"
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;