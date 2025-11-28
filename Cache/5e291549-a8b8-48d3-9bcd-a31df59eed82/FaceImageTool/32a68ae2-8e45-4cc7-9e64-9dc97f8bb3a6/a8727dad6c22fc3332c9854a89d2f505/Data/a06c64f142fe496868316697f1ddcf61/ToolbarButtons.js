"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarButtons = void 0;
var __selfType = requireType("./ToolbarButtons");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const MessageCenter_1 = require("./MessageCenter/MessageCenter");
const FaceImageMessages_1 = require("./MessageCenter/MessageTypes/FaceImageMessages");
let ToolbarButtons = class ToolbarButtons extends BaseScriptComponent {
    onAwake() {
        MessageCenter_1.MessageCenter.instance.subscribe(FaceImageMessages_1.CandideButtonMessage, (message) => {
            //@ts-ignore
            this.faceGridObject.enabled = message.checked;
        });
        MessageCenter_1.MessageCenter.instance.subscribe(FaceImageMessages_1.SymmetricModeButtonMessage, (message) => {
            //@ts-ignore
            this.effectEditor.setSymmetricStatus(message.checked);
        });
        MessageCenter_1.MessageCenter.instance.subscribe(FaceImageMessages_1.SnappingButtonMessage, (message) => {
            //@ts-ignore
            this.effectEditor.setSnappingStatus(message.checked);
        });
        MessageCenter_1.MessageCenter.instance.subscribe(FaceImageMessages_1.IsolateButtonMessage, (message) => {
            //@ts-ignore
            this.effectEditor.setIsolationStatus(message.checked);
        });
        MessageCenter_1.MessageCenter.instance.subscribe(FaceImageMessages_1.ResetButtonMessage, (message) => {
            this.main.getLensRegion().resetPosition();
            this.main.getLensRegion().resetScale();
        });
    }
};
exports.ToolbarButtons = ToolbarButtons;
exports.ToolbarButtons = ToolbarButtons = __decorate([
    component
], ToolbarButtons);
//# sourceMappingURL=ToolbarButtons.js.map