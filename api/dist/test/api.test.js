"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('GET /api/v1', () => {
    it('responds with a json message', (done) => {
        (0, supertest_1.default)(app_1.default)
            .get('/api/v1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
            message: 'API - 👋🌎🌍🌏',
        }, done);
    });
});
describe('GET /api/v1/emojis', () => {
    it('responds with a json message', (done) => {
        (0, supertest_1.default)(app_1.default)
            .get('/api/v1/emojis')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, ['😀', '😳', '🙄'], done);
    });
});
//# sourceMappingURL=api.test.js.map