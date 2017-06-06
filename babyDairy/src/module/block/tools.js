import React from "react";
import {PubSubEvent} from "../../../lib/util/pubSubEvent";
import {Util} from "../../../lib/util/util";
import '../../css/block/tools.css';
class Tools extends React.Component{
    constructor(props){
        super(props);
        this.state = {triggerEventType:''};
    }
    uploadImage(e){
        var elem = e.target;
        if(elem.className == "changeBak"){
            this.setState({triggerEventType:"changeBackground"});
        }else if(elem.className == "changeAvatar"){
            this.setState({triggerEventType:"changeAvatar"});
        }
        $(".tools").find(".uploadBg").trigger('click');
    }
    _onUploadBgChangeHandle(e){
        var promise = Util.uploadFile(e);
        promise.then(function(data){
            var url = data.url;
            if(url){
                if(this.state.triggerEventType == "changeBackground"){
                    this.props.reloadRequest("user","background",url);
                }else if(this.state.triggerEventType == "changeAvatar"){
                    PubSubEvent.publish("changeAvatar",[url]);
                    this.props.reloadRequest("user","avatar",url);
                }
            }
        }.bind(this));
    }
    render(){
        return (
            <div className="tools">   
                <img src="/babyDairy/src/image/chicken7.png" className="tool"/>
                <div className="toolList">
                    <img src="/babyDairy/src/image/chicken6.png" title="更换背景" className="changeBak" onClick={(e)=>this.uploadImage(e)}/>
                    <img src="/babyDairy/src/image/chicken4.png" title="更换头像" className="changeAvatar" onClick={(e)=>this.uploadImage(e)}/>
                    <input type="file"  className="uploadBg g-hidden"  onChange={(e)=>this._onUploadBgChangeHandle(e)}  />
                </div>
            </div>
        );
    }
};

export default Tools;