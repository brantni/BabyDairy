import React from "react";
import ReactDOM from "react-dom";

import Content from './module/baby/content';
import Header from './module/base/head';
import ImagePreview from './module/block/imagePreview';
import Tools from './module/block/tools';
import GotoTop from './module/block/gotoTop';

import {PubSubEvent} from "../lib/util/pubSubEvent";
import {Util} from "../lib/util/util";

import './css/base/main.css';

class MainContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {promise:this.loadDataFromFile(),bgStyle:{}};
        this.reloadRequest = this.reloadRequest.bind(this);
    }
    loadDataFromFile() {
        var p = new Promise(function(resolve){
            $.ajax({
                url: "/baby/initPage",
                dataType: 'json',
                cache: false,
                success: function(data) {
                    resolve(data);
                }
            });
        });
        return p;
    }
    componentDidMount() {
        this.state.promise.then(function(data){
            var backUrl = data.user[0].background.url,
                avatar = data.user[0].avatar.url;
            if(backUrl){
                var style = {
                    background: "url("+backUrl+")",
                    backgroundSize: "100% 100%"
                };
                this.setState({bgStyle:style});
            }
            if(avatar){
                PubSubEvent.publish("changeAvatar",[avatar]);
            }
        }.bind(this));
    }
    reloadRequest(type,subtype,url){
        if(subtype&&subtype == "background"){
            var style = {
                background: "url("+url+")",
                backgroundSize: "100% 100%"
            };
            this.setState({bgStyle:style});
        }
            
        $.ajax({
            url: "/reloadData",
            type:"get",
            data:{type:type,subtype:subtype,data:url}
        });
    }
    render(){
        return (
            <div className="mainContent" style={this.state.bgStyle}>   
                <Header title="life" />
                <Content loadData={this.state.promise}/>
                <ImagePreview />
                <GotoTop />
                <Tools reloadRequest = {this.reloadRequest}/>
            </div>
        );
    }
};

ReactDOM.render(
    <MainContent></MainContent>,
    $(".main-wrap")[0]
);