"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureResolutionController = void 0;
var __selfType = requireType("./TextureResolutionController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let TextureResolutionController = class TextureResolutionController extends BaseScriptComponent {
    onAwake() {
        let texResolution = new vec2(this.baseTexture.getWidth(), this.baseTexture.getHeight());
        this.textures.forEach((texture) => {
            let provider = texture.control;
            provider.inputTexture = this.baseTexture;
            provider.useScreenResolution = false;
            provider.resolution = texResolution;
        });
    }
};
exports.TextureResolutionController = TextureResolutionController;
exports.TextureResolutionController = TextureResolutionController = __decorate([
    component
], TextureResolutionController);
//# sourceMappingURL=TextureResolutionController.js.map