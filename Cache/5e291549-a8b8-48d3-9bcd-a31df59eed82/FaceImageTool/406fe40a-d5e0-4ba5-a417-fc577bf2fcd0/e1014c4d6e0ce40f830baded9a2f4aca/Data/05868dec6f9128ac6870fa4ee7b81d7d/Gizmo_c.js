if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input SceneObject frameObject
checkUndefined("frameObject", []);
// @input Asset.Material frameMaterial
checkUndefined("frameMaterial", []);
// @input SceneObject[] pointsParent
checkUndefined("pointsParent", []);
// @input SceneObject centerPoint
checkUndefined("centerPoint", []);
// @input SceneObject[] manipulatePoints
checkUndefined("manipulatePoints", []);
// @input SceneObject[] rotationPoints
checkUndefined("rotationPoints", []);
// @input SceneObject[] horizontalLines
checkUndefined("horizontalLines", []);
// @input SceneObject[] verticalLines
checkUndefined("verticalLines", []);
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../Modules/Src/Src/Scripts/Editor/Gizmo");
Object.setPrototypeOf(script, Module.Gizmo.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
