import React from "react";
import '../../css/base/head.css';
class Header extends React.Component{
  render() {
    var lifeClass="",photoClass="";
    if(this.props.title == "life"){
        lifeClass =  "navBack";
    }else if(this.props.title == "photo"){
        photoClass = "navBack";
    }
    return (
        <header>
            <span className="hello">您好！宝宝</span>
            <nav>个人信息</nav>
            <a href="/babyDairy/baby.html" className={lifeClass} ><nav>生活记事</nav></a>
            <a href="/babyDairy/photo.html" className={photoClass} ><nav>萌照</nav></a>
        </header>
    );
  }
};

export default Header;
