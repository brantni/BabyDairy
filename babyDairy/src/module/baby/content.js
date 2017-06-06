import React from "react";
import BabyForm from './babyForm';
import {LifeList,Life} from './lifeItems';
import {PhotoList,Photo} from './photoItems';
import {PubSubEvent} from "../../../lib/util/pubSubEvent";
import '../../css/baby/main.css';
class Content extends React.Component{
    constructor(props){
        super(props);
        this.state = {lifeData: [],photoData:[],avatar:''};
        this.getBabyFormData = this.getBabyFormData.bind(this);
    }
    componentDidMount() {
        this.props.loadData.then(function(data){
            this.setState({lifeData:data.life.length?data.life:[],photoData:data.photo.length?data.photo:[]});
        }.bind(this));

        PubSubEvent.subscribe("changeAvatar",function(data){
            this.setState({avatar:data});
        }.bind(this));
    }
    getBabyFormData(formData){
        let data;
        if(formData.url){
            data = this.state.photoData;
            data.unshift(formData);
            this.setState({photoData:data});
        }else{
            data = this.state.lifeData;
            data.unshift(formData);
            this.setState({lifeData:data});
        }
    }
    render() {
        return (
            <div className="content">
                <BabyForm onSubmitBabyForm = {this.getBabyFormData} />
                <LifeList data = {this.state.lifeData} avatar = {this.state.avatar}/>
                <PhotoList data = {this.state.photoData} avatar = {this.state.avatar} />
            </div>   
        );
    }
};

export default Content;