"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gizmo = void 0;
var __selfType = requireType("./Gizmo");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const SharedContent_1 = require("../Shared/SharedContent");
const LensRegion_1 = require("../Common/Utilities/LensRegion/LensRegion");
let Gizmo = class Gizmo extends BaseScriptComponent {
    onAwake() {
        this.screenT = this.getSceneObject().getComponent("Component.ScreenTransform");
        this.parentScreenT = this.getSceneObject().getParent().getComponent("Component.ScreenTransform");
        this.anchors = this.screenT.anchors;
        this.deviceCameraTexture = SharedContent_1.SharedContent.getInstance().deviceCameraTexture;
        this.oppositeIdxs = [1, 0, 3, 2, 5, 4, 7, 6];
        this.adjacentIdxs[0] = { "x": null, "y": 1 };
        this.adjacentIdxs[1] = { "x": null, "y": 0 };
        this.adjacentIdxs[2] = { "x": 3, "y": null };
        this.adjacentIdxs[3] = { "x": 2, "y": null };
        this.adjacentIdxs[4] = { "x": 6, "y": 7 };
        this.adjacentIdxs[5] = { "x": 7, "y": 6 };
        this.adjacentIdxs[6] = { "x": 4, "y": 5 };
        this.adjacentIdxs[7] = { "x": 5, "y": 4 };
        this.faceRegionScale[FaceInsetRegion.LeftEye] = new vec2(0.54, 0.19);
        this.faceRegionScale[FaceInsetRegion.RightEye] = new vec2(0.54, 0.19);
        this.faceRegionScale[FaceInsetRegion.Mouth] = new vec2(0.66, 0.21);
        this.faceRegionScale[FaceInsetRegion.Nose] = new vec2(0.5, 0.5);
        this.faceRegionScale[FaceInsetRegion.Face] = new vec2(1.5, 1.2);
        this.initSize = new vec2(0.502, 0.28);
        this.prevFaceRegion = FaceInsetRegion.Mouth;
        this.anchors.setSize(this.initSize);
        this.centerPointT = this.centerPoint.getComponent("Component.ScreenTransform");
        this.manipulatePoints.forEach((obj, idx) => {
            let interactionComponent = this.createInteractionComponent(obj);
            this.setUpTouchEvents(interactionComponent, idx, this.onTMove);
            let screenTransform = obj.getComponent("Component.ScreenTransform");
            this.updateZPoz(screenTransform, 0.2);
            this.manipulatePointsT.push(screenTransform);
        });
        this.rotationPoints.forEach((obj, idx) => {
            let interactionComponent = this.createInteractionComponent(obj);
            this.setUpTouchEvents(interactionComponent, idx, this.onTMoveRotation);
            let screenTransform = obj.getComponent("Component.ScreenTransform");
            this.updateZPoz(screenTransform, 0.1);
            this.rotationPointsT.push(screenTransform);
        });
        this.horizontalLines.forEach((obj) => {
            let screenTransform = obj.getComponent("Component.ScreenTransform");
            this.updateZPoz(screenTransform, 0.1);
            this.horizontalLinesT.push(screenTransform);
        });
        this.verticalLines.forEach((obj) => {
            let screenTransform = obj.getComponent("Component.ScreenTransform");
            this.updateZPoz(screenTransform, 0.1);
            this.verticalLinesT.push(screenTransform);
        });
    }
    updateGizmoData(newRot, newScale, newPivot) {
        if (this.touchIsBusy) {
            return;
        }
        // this.screenT.rotation = quat.fromEulerAngles(0, 0, newRot.z * Math.PI / 180);
        let prevPivotPos = this.screenT.screenPointToParentPoint(this.screenT.localPointToScreenPoint(this.screenT.pivot));
        let newSize = new vec2(newScale.x * this.initSize.x, newScale.y * this.initSize.y);
        this.anchors.setSize(newSize);
        let newPivotPos = this.screenT.screenPointToParentPoint(this.screenT.localPointToScreenPoint(this.screenT.pivot));
        let newCenter = this.screenT.anchors.getCenter().add(prevPivotPos.sub(newPivotPos));
        this.screenT.anchors.setCenter(newCenter);
        this.centerPointT.anchors.setCenter(newPivot);
    }
    createInteractionComponent(obj) {
        obj.createComponent("Component.InteractionComponent");
        let interactionComponent = obj.getComponent("Component.InteractionComponent");
        interactionComponent.setCamera(SharedContent_1.SharedContent.getInstance().orthoCamera);
        interactionComponent.isFilteredByDepth = true;
        interactionComponent.addMeshVisual(obj.getComponent("Component.Image"));
        interactionComponent.enabled = true;
        return interactionComponent;
    }
    setUpTouchEvents(interactionComponent, idx, onTMove) {
        let prevTouchPos;
        let curTouchId = -1;
        interactionComponent.onTouchStart.add((eventData) => {
            if (this.touchIsBusy || LensRegion_1.LensRegion.isBusy) {
                return;
            }
            this.touchIsBusy = true;
            prevTouchPos = eventData.position;
            curTouchId = eventData.touchId;
            this.onTouchStartCallback(eventData.position);
        });
        interactionComponent.onTouchMove.add((eventData) => {
            if (eventData.touchId != curTouchId || LensRegion_1.LensRegion.isBusy) {
                return;
            }
            onTMove(this, eventData.position, prevTouchPos, idx);
            prevTouchPos = eventData.position;
        });
        interactionComponent.onTouchEnd.add((eventData) => {
            if (eventData.touchId != curTouchId) {
                return;
            }
            curTouchId = -1;
            this.touchIsBusy = false;
            this.onTouchEndCallback(eventData.position);
        });
    }
    onTMove(_this, position, prevTouchPosition, idx) {
        let horizontalData = null;
        let verticalData = null;
        let newPos = null;
        var prevPivot = _this.screenT.pivot;
        let prevPos1 = _this.screenT.screenPointToParentPoint(_this.screenT.localPointToScreenPoint(vec2.zero()));
        _this.screenT.pivot = vec2.zero();
        let newPos1 = _this.screenT.screenPointToParentPoint(_this.screenT.localPointToScreenPoint(vec2.zero()));
        let newCenter1 = _this.screenT.anchors.getCenter().add(prevPos1.sub(newPos1));
        _this.screenT.anchors.setCenter(newCenter1);
        if (_this.adjacentIdxs[idx].x != null) {
            horizontalData = _this.getNewSizeData(idx, _this.adjacentIdxs[idx].x, position);
        }
        if (_this.adjacentIdxs[idx].y != null) {
            verticalData = _this.getNewSizeData(idx, _this.adjacentIdxs[idx].y, position);
        }
        if (horizontalData && horizontalData.isValid && verticalData && verticalData.isValid) {
            newPos = position;
        }
        else if (horizontalData && horizontalData.isValid) {
            newPos = horizontalData.newPos;
        }
        else if (verticalData && verticalData.isValid) {
            newPos = verticalData.newPos;
        }
        else {
            return;
        }
        let oppositePos = _this.screenT.localPointToScreenPoint(_this.manipulatePointsT[_this.oppositeIdxs[idx]].anchors.getCenter());
        let newCenter = newPos.add(oppositePos).uniformScale(0.5);
        _this.anchors.setCenter(_this.screenT.screenPointToParentPoint(newCenter));
        let prevSize = _this.anchors.getSize();
        if (horizontalData && horizontalData.isValid) {
            prevSize.x *= horizontalData.newDist / horizontalData.prevDist;
        }
        if (verticalData && verticalData.isValid) {
            prevSize.y *= verticalData.newDist / verticalData.prevDist;
        }
        _this.anchors.setSize(prevSize);
        let curScale = _this.screenT.scale;
        curScale.x = prevSize.x / _this.initSize.x;
        curScale.y = prevSize.y / _this.initSize.y;
        let prevPos2 = _this.screenT.screenPointToParentPoint(_this.screenT.localPointToScreenPoint(vec2.zero()));
        _this.screenT.pivot = prevPivot;
        let newPos2 = _this.screenT.screenPointToParentPoint(_this.screenT.localPointToScreenPoint(vec2.zero()));
        let newCenter2 = _this.screenT.anchors.getCenter().add(prevPos2.sub(newPos2));
        _this.screenT.anchors.setCenter(newCenter2);
        _this.onPositionChanged(newCenter);
        _this.onScaleChanged(curScale);
    }
    getNewSizeData(idx, oppositeIdx, newPosition) {
        let pointPos = this.screenT.localPointToScreenPoint(this.manipulatePointsT[idx].anchors.getCenter());
        let oppositePointPos = this.screenT.localPointToScreenPoint(this.manipulatePointsT[oppositeIdx].anchors.getCenter());
        let newPos = new vec2(newPosition.x, newPosition.y);
        let aspect = this.deviceCameraTexture.getHeight() / this.deviceCameraTexture.getWidth();
        pointPos.y *= aspect;
        oppositePointPos.y *= aspect;
        newPos.y *= aspect;
        let forward = pointPos.sub(oppositePointPos);
        forward = forward.normalize();
        let right = new vec2(forward.y, -forward.x);
        let prevDist = pointPos.distance(oppositePointPos);
        let dir = newPos.sub(pointPos);
        let dist = newPos.distance(pointPos);
        dist = this.calculateDistanceToOppositeSide(forward, dir, dist);
        newPos = pointPos.add(forward.uniformScale(dist));
        let newDist = newPos.distance(oppositePointPos);
        let isValid = (newDist > 0.01) && (this.isRightSide(right, oppositePointPos, pointPos) == this.isRightSide(right, oppositePointPos, newPos));
        newPos.y /= aspect;
        return { "isValid": isValid, "newPos": newPos, "prevDist": prevDist, "newDist": newDist };
    }
    onTMoveRotation(_this, position, prevTouchPosition, idx) {
        // let objCenter = _this.parentScreenT.localPointToScreenPoint(_this.anchors.getCenter());
        let objCenter = _this.centerPointT.localPointToScreenPoint(vec2.zero());
        let dir = prevTouchPosition.sub(objCenter);
        dir = dir.normalize();
        let newDir = position.sub(objCenter);
        newDir = newDir.normalize();
        let angle = _this.getAngleBetweenVectors([newDir.x, newDir.y], [dir.x, dir.y]);
        let curAngle = _this.screenT.rotation.toEulerAngles().z + angle;
        let newRot = quat.fromEulerAngles(0, 0, curAngle);
        _this.screenT.rotation = newRot;
        _this.onRotationChanged(newRot, angle);
    }
    updateZPoz(screenTransform, newZPos) {
        let curPosition = screenTransform.position;
        curPosition.z = newZPos;
        screenTransform.position = curPosition;
    }
    setDefault() {
        this.pointsParent.forEach((obj) => {
            obj.enabled = false;
        });
        this.frameMaterial.mainPass.Active = false;
    }
    setActive() {
        this.pointsParent.forEach((obj) => {
            obj.enabled = true;
        });
        this.frameMaterial.mainPass.Active = true;
    }
    onHoverStart() {
        this.frameMaterial.mainPass.Hover = true;
    }
    onHoverEnd() {
        this.frameMaterial.mainPass.Hover = false;
    }
    updateScale(mainScale) {
        let newScale = vec3.one().uniformScale(1 / mainScale);
        this.centerPointT.scale = newScale;
        this.manipulatePointsT.forEach((curScreenT) => {
            curScreenT.scale = newScale;
        });
        this.rotationPointsT.forEach((curScreenT) => {
            curScreenT.scale = newScale;
        });
        this.horizontalLinesT.forEach((curScreenT) => {
            let curScale = curScreenT.scale;
            curScale.y = newScale.y;
            curScreenT.scale = curScale;
        });
        this.verticalLinesT.forEach((curScreenT) => {
            let curScale = curScreenT.scale;
            curScale.x = newScale.x;
            curScreenT.scale = curScale;
        });
    }
    calculateDistanceToOppositeSide(forward, dir, dist) {
        let angle = forward.angleTo(dir);
        let curDist = Math.cos(angle) * dist;
        return curDist;
    }
    getAngleBetweenVectors(vector1, vector2) {
        let dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
        let crossProduct = vector1[0] * vector2[1] - vector1[1] * vector2[0];
        let magnitude1 = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);
        let magnitude2 = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);
        let cosTheta = dotProduct / (magnitude1 * magnitude2);
        if (cosTheta > 1) {
            return 0;
        }
        let radians = Math.acos(cosTheta);
        let sign = 1;
        if (crossProduct < 0) {
            sign = -1;
        }
        let degrees = sign * radians * (180 / Math.PI);
        if (degrees < 0) {
            degrees += 360;
        }
        return sign * radians;
    }
    isRightSide(right, pos, pt) {
        let x1, x2, x3, y1, y2, y3, D;
        x1 = pos.x;
        y1 = pos.y;
        x2 = 0;
        y2 = 0;
        x3 = pt.x;
        y3 = pt.y;
        D = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);
        return D < 0;
    }
    __initialize() {
        super.__initialize();
        this.onTouchStartCallback = (screenPos) => { };
        this.onTouchEndCallback = (screenPos) => { };
        this.onPositionChanged = () => { };
        this.onRotationChanged = () => { };
        this.onScaleChanged = () => { };
        this.oppositeIdxs = [];
        this.adjacentIdxs = {};
        this.manipulatePointsT = [];
        this.rotationPointsT = [];
        this.horizontalLinesT = [];
        this.verticalLinesT = [];
        this.faceRegionScale = {};
        this.touchIsBusy = false;
    }
};
exports.Gizmo = Gizmo;
exports.Gizmo = Gizmo = __decorate([
    component
], Gizmo);
//# sourceMappingURL=Gizmo.js.map