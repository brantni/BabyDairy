import React from "react";
import '../../css/photo/photoList.css';
import {PubSubEvent} from "../../../lib/util/pubSubEvent";

class Photo extends React.Component{
    render() {
        return (
            <div className="photo js-photo" data-index={this.props.id}>   
                <div className="pic"> 
                    <img src={this.props.url}  title="查看"/>
                </div>
                <div className="text">
                    <div className="title" title={this.props.title} >{this.props.title}</div>
                    <div className="date">{this.props.uploaddate}</div>
                </div>
            </div>
        );
    }
};

class PhotoList extends React.Component{
    _onPhotoClickHandle(e){
        let index = $(this).data().index;
        PubSubEvent.publish("sliderShow",[index]);
        // $(this).addClass('expand');
    }
    componentDidMount(){
        let context = $(".js-photoList");
        context.on('click', '.js-photo', this._onPhotoClickHandle);
    }
    render(){
        let photoNodes = this.props.data.map(function(photo,index) {
            if(photo.url){
                return (
                    <Photo  key={photo.id} id={index} title={photo.title} url={photo.url} uploaddate={photo.uploaddate} />
                );
            }
        }.bind(this));
        return (
            <div className="photoList js-photoList">
                {photoNodes }
            </div>
        );
    }
};
export {PhotoList,Photo};
