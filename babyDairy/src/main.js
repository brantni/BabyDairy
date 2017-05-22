var Header = React.createClass({
    _onClickHandler:function(e){
        var elem = e.target;
        if(e.target.tagName.toLowerCase() === "nav"){
            $(elem).addClass('navBack').siblings('nav').removeClass('navBack');
        }
    },
    componentDidMount:function(){
        document.getElementsByTagName("header")[0].addEventListener('click', this._onClickHandler, false);
    },
    render: function() {
        return (
            <header>
                <span className="hello">您好！宝宝</span>
                <nav>个人信息</nav>
                <nav>生活记事</nav>
                <nav>萌照</nav>
            </header>
        );
    }
});

var UploadImage = React.createClass({
    getInitialState: function() {
        return {hiddenClass: 'g-hidden'};
    },
    _onClickUploadImgHandle:function(e){
        var file = $("#file");
        file.trigger('click');
    },
    _onFileChangeHandle:function(e){
        var promise = Util.uploadFile(e);
        promise.then(function(data){
            var url = data.url
            if(url){    
                this.setState({hiddenClass: ''});
                this.props.onGetImageHandle(url);
                PubSubEvent.publish("imageFillUrl",[url]);
            }
        }.bind(this));
    },
    hidePreview:function(){
        this.setState({hiddenClass: 'g-hidden'});
    },
    _onClickPreviewImgHandle:function(){
        PubSubEvent.publish("imagePreviewShow");
    },
    render: function() {
        return (
            <div className="uploadImage">
                <img src="/babyDairy/src/image/chicken1.png" title="上传图片" className="uploadImg" onClick={this._onClickUploadImgHandle} />
                <a href="####" className={this.state.hiddenClass} id="previewImg" onClick={this._onClickPreviewImgHandle}>点击预览</a>
                <input type="file" id="file" className="file"  onChange={this._onFileChangeHandle}  />
            </div>
        );
    }
});

var ImagePreview = React.createClass({
    getInitialState: function() {
        return {hiddenClass: 'g-hidden',url:''};
    },
    _onClickHandler: function(e) {
        this.setState({hiddenClass: 'g-hidden'});
    },
    imagePreviewShowHandle:function(){
        this.setState({hiddenClass: ''});
    },
    imageFillUrlHandle:function(url){
        this.setState({url: url});
    },
    componentDidMount:function(){
        $(".backclose").on('click', this._onClickHandler);
        PubSubEvent.subscribe("imagePreviewShow",this.imagePreviewShowHandle);
        PubSubEvent.subscribe("imageFillUrl",this.imageFillUrlHandle);
    },
    render: function() {
        var c = 'back '+this.state.hiddenClass;
        return (
            <div className={c}>
                <div className='picPreview'>
                    <img src={this.state.url} /><i className='backclose' />
                </div>
            </div>
        );
    }
});

var BabyForm = React.createClass({
    getInitialState: function() {
        return {focusTitleClass: '',focusTextareaClass: '',titleValue:'',textareaValue:'',url:''};
    },
    _onChangeHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({titleValue: elem.value});
        }else if(tagName == "textarea"){
            this.setState({textareaValue: elem.value});
        }
    },
    _onGetImageHandle:function(url){
        if(url){
            this.setState({url:url});
        }
    },
    _onFocusHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: 'textarea_focus'});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: 'textarea_focus'});
        }
    },
    _onBlurHandle:function(e){
        var elem = e.target,
            tagName = elem.tagName.toLowerCase();
        if(tagName == "input"){
            this.setState({focusTitleClass: ''});
        }else if(tagName == "textarea"){
            this.setState({focusTextareaClass: ''});
        }
    },
    _onSubmitHandle:function(e){
        var titleval = this.state.titleValue,
            textareaval = this.state.textareaValue,
            url = this.state.url;
        
        if(textareaval||url){
            var comment = {title:titleval,text:textareaval,url:url};
            $.ajax({
                type: "get",
                url: '/submit',
                data:comment,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    if(data.status==1){
                        this.props.onSubmitBabyForm(comment);
                        this.setState({titleValue:'',textareaValue:'',url:''});
                        this.refs["preImage"].hidePreview();
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    // console.error(err.toString());
                }.bind(this)
            });
        }else{
            alert("写点什么吧！");
        }
    },
    render: function() {
        var tClass = "babyinput babytextarea "+this.state.focusTextareaClass,
            titleClass = "babyinput babytitle "+this.state.focusTitleClass;
        return (
            <div className="box babyform g-clear">
                <input placeholder="标题" maxLength="80" value={this.state.titleValue} onChange={this._onChangeHandle} onBlur={this._onBlurHandle} onFocus={this._onFocusHandle} className={titleClass} />
                <textarea placeholder="宝宝今天有什么新鲜事吗？" onChange={this._onChangeHandle} onBlur={this._onBlurHandle} value={this.state.textareaValue} onFocus={this._onFocusHandle} name="babyinput" className={tClass}></textarea>
                <UploadImage onGetImageHandle={this._onGetImageHandle} ref = "preImage"></UploadImage>
                <a href="####" className="babysubmit" onClick={this._onSubmitHandle}>发布</a>
            </div>
        );
    }
});

var Life = React.createClass({
    render:function(){
        return (
            <div className="box life g-clear">
                <img src={this.props.avatar} className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div>{this.props.text}</div>
            </div>
        );
    }
});

var LifeList = React.createClass({
    render:function(){
        var lifeNodes = this.props.data.map(function(life) {
            if(!life.url){
                return (
                    <Life text={life.text} title={life.title}  avatar={this.props.avatar}/>
                );
            }
        }.bind(this));
        return (
            <div className="lifeList">
                {lifeNodes}
            </div>
        );
    }
});
var Photo = React.createClass({
    getInitialState: function() {
        return {photoClass: 'photo-small'};
    },
    photoStateChange:function(e){
        var elem = $(e.target);
        if(this.state.photoClass === "photo-small"){
            this.setState({photoClass: 'photo-big'});
            elem.parent().height(elem.parent().height()+200);
        }else{
            this.setState({photoClass: 'photo-small'});
            elem.parent().height(elem.parent().height()-200);
        }
    },
    render:function(){
        var pClass = "photo-baoImg "+this.state.photoClass;
        return (
            <div className="box photo">
                <img src={this.props.avatar} className="avatarImg" />
                <h3>{this.props.title}</h3>
                <div className="photo-content">
                    <p>{this.props.text}</p>
                    <img src={this.props.url} className={pClass} />
                </div>
            </div>
        );
    }
});
var PhotoList = React.createClass({
    _onClickHandler:function(e){
        var $elem = $(e.target),
            $parent = $(".photoList .photo-baoImg");
        this.refs["photo"+$parent.index($elem)].photoStateChange(e);
    },
    componentDidMount:function(){
        $(".photoList").on('click', '.photo-baoImg', this._onClickHandler);
    },
    render:function(){
        var photoNodes = this.props.data.map(function(photo,index) {
            if(photo.url){
                var key = "photo"+index;
                return (
                    <Photo ref={key} text={photo.text} title={photo.title} url={photo.url} avatar={this.props.avatar} />
                );
            }
        }.bind(this));
        return (
            <div className="photoList">
                {photoNodes}
            </div>
        );
    }
});
var Content = React.createClass({
    getInitialState: function() {
        return {lifeData: [],photoData:[],avatar:''};
    },
    componentDidMount: function() {
        this.props.loadData.then(function(data){
            this.setState({lifeData:data.life.length?data.life:[],photoData:data.photo.length?data.photo:[]});
        }.bind(this));

        PubSubEvent.subscribe("changeAvatar",function(data){
            this.setState({avatar:data});
        }.bind(this));
    },
    getBabyFormData:function(formData){
        var data;
        if(formData.url){
            data = this.state.photoData;
            data.unshift(formData);
            this.setState({photoData:data});
        }else{
            data = this.state.lifeData;
            data.unshift(formData);
            this.setState({lifeData:data});
        }
    },
    render:function(){
        return (
            <div className="content">
                <BabyForm onSubmitBabyForm = {this.getBabyFormData} />
                <LifeList data = {this.state.lifeData} avatar = {this.state.avatar}/>
                <PhotoList data = {this.state.photoData} avatar = {this.state.avatar} />
            </div>   
        );
    }
});

var GotoTop = React.createClass({
    getInitialState: function() {
        return {show:'',scrolltimer:null};
    },
    _onscrollHandle:function(e){
        var scrolltimer = this.state.scrolltimer;
        if(scrolltimer!=null){
            return;
        }
        scrolltimer = setTimeout(function(){
            var topdistance = document.body.scrollTop;
            if(topdistance>300){
                this.setState({show:"show"});
            }else{
                this.setState({show:""});
            }
            clearTimeout(scrolltimer);
            scrolltimer = null;
            this.setState({scrolltimer:null});
        }.bind(this), 300);
        this.setState({scrolltimer:scrolltimer});
    },
    _onclickTopHandle:function(){
        document.body.scrollTop = 0;
    },
    componentDidMount: function() {
        document.addEventListener("scroll",this._onscrollHandle,false);
    },
    componentWillUnmount: function() {
        document.removeEventListener("scroll", this._onscrollHandle, false);
    },
    render:function(){
        var topClass = "top "+this.state.show;
        return (
            <div className="gotoTop">   
                <div className={topClass} id="gotoTop" onClick={this._onclickTopHandle}>
                    <img src="/babyDairy/src/image/top.png"/>
                </div>
            </div>
        );
    }
});

var Tools = React.createClass({
    getInitialState: function() {
        //changeBackground为改变背景图片，changeAvatar为改变头像
        return {triggerEventType:""};
    },
    uploadImage:function(e){
        var elem = e.target;
        if(elem.className == "changeBak"){
            this.setState({triggerEventType:"changeBackground"});
        }else if(elem.className == "changeAvatar"){
            this.setState({triggerEventType:"changeAvatar"});
        }
        $(".tools").find(".uploadBg").trigger('click');
    },
    _onUploadBgChangeHandle:function(e){
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
    },
    render:function(){
        return (
            <div className="tools">   
                <img src="/babyDairy/src/image/chicken7.png" className="tool"/>
                <div className="toolList">
                    <img src="/babyDairy/src/image/chicken6.png" title="更换背景" className="changeBak" onClick={this.uploadImage}/>
                    <img src="/babyDairy/src/image/chicken4.png" title="更换头像" className="changeAvatar" onClick={this.uploadImage}/>
                    <input type="file"  className="uploadBg g-hidden"  onChange={this._onUploadBgChangeHandle}  />
                </div>
            </div>
        );
    }
});

var MainContent = React.createClass({
    loadDataFromFile: function() {
        var p = new Promise(function(resolve){
            $.ajax({
                url: "/initPage",
                dataType: 'json',
                cache: false,
                success: function(data) {
                    resolve(data);
                }
            });
        });
        return p;
    },
    componentDidMount: function() {
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
    },
    getInitialState: function() {
        var p = this.loadDataFromFile();
        return {promise:p,bgStyle:{}};
    },
    reloadRequest:function(type,subtype,url){
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
    },
    render:function(){
        return (
            <div className="mainContent" style={this.state.bgStyle}>   
                <Header />
                <Content loadData={this.state.promise}/>
                <ImagePreview />
                <GotoTop />
                <Tools reloadRequest = {this.reloadRequest}/>
            </div>
        );
    }
});

ReactDOM.render(
    <MainContent></MainContent>,
    $(".main-wrap")[0]
);