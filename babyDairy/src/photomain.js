import React from "react";
import ReactDOM from "react-dom";

import Header from './module/base/head';
import {PhotoList,Photo} from './module/photo/photoItems';
import PhotoSlider from './module/photo/photoSlider';

import './css/base/main.css';
import './css/photo/mainContent.css';

class MainContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {photoData:[]};
    }
    loadDataFromFile() {
        $.ajax({
            url: "/photo/initPage",
            dataType: 'json',
            cache: false,
            success: function(data) {
                if(data){
                    this.setState({photoData:data.photolove.length?data.photolove:[]});
                }
            }.bind(this)
        });
    }
    componentDidMount () {
        this.loadDataFromFile();
    }
    render(){
        return (
            <div className="mainContent">   
                <Header  title="photo" />
                <PhotoList data={this.state.photoData}/>
                <PhotoSlider data={this.state.photoData} />
            </div>
        );
    }
};

ReactDOM.render(
    <MainContent></MainContent>,
    $(".main-wrap")[0]
);