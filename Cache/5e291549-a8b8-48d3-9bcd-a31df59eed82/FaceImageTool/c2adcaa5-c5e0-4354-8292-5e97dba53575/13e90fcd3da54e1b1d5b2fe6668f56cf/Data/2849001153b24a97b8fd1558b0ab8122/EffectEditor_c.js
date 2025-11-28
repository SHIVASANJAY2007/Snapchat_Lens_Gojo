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
// @input Component.ScriptComponent main
checkUndefined("main", []);
// @input Component.ScriptComponent snappingScript
checkUndefined("snappingScript", []);
// @input SceneObject editorObject
checkUndefined("editorObject", []);
// @input Component.ScreenTransform screenTransform
checkUndefined("screenTransform", []);
// @input SceneObject effects
checkUndefined("effects", []);
// @input Component.Image editorImage
checkUndefined("editorImage", []);
// @input float editorFrameWidth
checkUndefined("editorFrameWidth", []);
// @input float editorFrameHeight
checkUndefined("editorFrameHeight", []);
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
var Module = require("../../../../Modules/Src/Src/Scripts/Editor/EffectEditor");
Object.setPrototypeOf(script, Module.EffectEditor.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
