define("templateConfig",[],function(){"use strict";return{base:{attributes:{ignore:["id","class","data-urushi-type","data-urushi-options","disabled","readonly"]}},card:{name:'Card',className:'card',requires:[],method:{id:'getField',cardClass:'getOptionalClasses',title:'getUrushiOption',titleImg:'getUrushiOption',content:'getChildNodesFunction'},options:{id:'id'}},alert:{name:"Alert",className:"alert",requires:["content"],method:{id:"getField",alertClass:"getOptionalClasses",header:"getUrushiOption",content:"getField",isDisplayCloseIcon:"getUrushiOption"},options:{id:"id",content:"innerHTML"},attributes:{target:"rootNode",ignore:["content"]}},button:{name:"Button",className:"button",requires:["label"],method:{id:"getField",buttonClass:"getOptionalClasses",label:"getField"},options:{id:"id",label:"innerHTML"},attributes:{target:"rootNode",ignore:["label"]}},checkbox:{name:"Checkbox",className:"checkbox",requires:[],method:{id:"getField",checkboxClass:"getOptionalClasses",label:"getNextText",checked:"getField"},options:{id:"id",checked:"checked"},remove:["removeNextNode"],attributes:{target:"inputNode",ignore:["checked"]}},dialog:{name:"Dialog",className:"dialog",requires:["content"],method:{id:"getField",dialogClass:"getOptionalClasses",header:"getUrushiOption",content:"getChildNodesFunction",footer:"getUrushiOption",duration:"getUrushiOption",isDisplayCloseIcon:"getUrushiOption",isUnderlayClickClose:"getUrushiOption"},options:{id:"id"},attributes:{target:"dialogNode",ignore:[""]}},dropdown:{name:"DropDown",className:"dropdown",requires:[],method:{id:"getField",className:"getOptionalClasses",items:function(e){var t,i,o,a=e.children,n=[];for(i=0,o=a.length;o>i;i++)t={},t.label=(a[i].textContent||"").trim(),t.value=a[i].value||"",n.push(t);return n}},options:{id:"id"},attributes:{target:"inputNode",ignore:["value"]},setValue:{name:"setSelected",args:["value"]}},input:{name:"Input",className:"input",requires:[],method:{id:"getField",inputClass:"getOptionalClasses",placeholder:"getAttribute",hint:"getUrushiOption",value:"getAttribute"},options:{id:"id",placeholder:"placeholder",value:"value"},attributes:{target:"inputNode",ignore:["value","placeholder"]},setValue:{name:"setValue",args:["value"]}},panel:{name:"Panel",className:"panel",requires:[],method:{id:"getField",panelClass:"getOptionalClasses",header:"getUrushiOption",content:"getChildNodesFunction",footer:"getUrushiOption"},options:{id:"id"},attributes:{target:"rootNode",ignore:[""]}},radiobox:{name:"Radiobox",className:"radiobox",requires:["name"],method:{id:"getField",radioboxClass:"getOptionalClasses",name:"getAttribute",value:"getAttribute",label:"getNextText",checked:"getField"},options:{id:"id",name:"name",value:"value",checked:"checked"},remove:["removeNextNode"],attributes:{target:"inputNode",ignore:[""]}},textarea:{name:"Textarea",className:"textarea",requires:[],method:{id:"getField",textareaClass:"getOptionalClasses",placeholder:"getAttribute",hint:"getUrushiOption",value:"getAttribute"},options:{id:"id",placeholder:"placeholder",value:"value"},attributes:{target:"inputNode",ignore:["value","placeholder"]},setValue:{name:"setValue",args:["value"]}},togglebutton:{name:"ToggleButton",className:"togglebutton",requires:["label"],method:{id:"getField",toggleButtonClass:"getOptionalClasses",label:function(e,t){var i,o,a,n,r=["previousSibling","nextSibling"];for(i=0,o=r.length;o>i;i++)if(a=e[r[i]],a&&a.wholeText&&a.wholeText.trim())return n=a.wholeText.trim(),a.remove?a.remove():a.parentNode.removeChild(a),n;return""},checked:function(e,t){return e.hasAttribute("checked")&&!0||!1}},options:{id:"id",checked:"checked"},attributes:{target:"inputNode",ignore:["checked"]}},tooltip:{name:"Tooltip",className:"tooltip",requires:[],method:{id:"getUrushiAdditionOption",tooltipClass:"getUrushiAdditionOption",position:"getUrushiAdditionOption",content:"getUrushiAdditionOption",on:"getUrushiAdditionOption",off:"getUrushiAdditionOption"},options:{id:"id",tooltipClass:"tooltipClass",position:"position",content:"content",on:"on",off:"off"},attributes:{target:"rootNode",ignore:[""]}},fileinput:{name:"FileInput",className:"fileinput",requires:[],method:{id:"getField",label:"getUrushiOption",url:"getUrushiOption",additionalClass:"getOptionalClasses",allowedTypes:"getUrushiOption"},options:{id:"id"},attributes:{target:"rootNode",ignore:[]}},uploadmanager:{name:"UploadManager",className:"uploadmanager",requires:[],method:{id:"getField",url:"getUrushiOption",uploadManagerClass:"getOptionalClasses",allowedTypes:"getUrushiOption"},options:{id:"id",url:"url",allowedTypes:"allowedTypes"},attributes:{target:"rootNode",ignore:[]}},hamburger:{name:"Hamburger",className:"hamburger",requires:[],method:{id:"getField"},options:{id:"id"},attributes:{target:"rootNode",ignore:[]}},contextmenu:{name:"ContextMenu",className:"contextmenu",requires:[],method:{id:"getField",bubbling:"getUrushiOption",type:"getUrushiOption",items:function(e){var t,i,o,a=e.children,n=[];for(t=0,i=a.length;i>t;t++)o={},o.liId=a[t].id,o.name=a[t].getAttribute("name"),o.label=(a[t].textContent||"").trim(),o.icon=a[t].className||"",n.push(o);return n}},options:{id:"id"},attributes:{target:"rootNode",ignore:[]}},grid:{name:"Grid",className:"grid",requires:[],method:{id:"getField",rowsPerPage:"getUrushiOption",paginationArea:"getUrushiOption",selection:"getUrushiOption",header:function(e){var t,i,o,a,n=[];if(!e.children[0]||!e.children[0].children[0]||!e.children[0].children[0].children)throw new Error("Invalid header.");for(t=e.children[0].children[0].children,i=0,o=t.length;o>i;i++)a={},a.name=t[i].getAttribute("name")||"",a.value=t[i].childNodes||"",n.push(a);return n}},options:{id:"id"},attributes:{target:"rootNode",ignore:[]}}}});