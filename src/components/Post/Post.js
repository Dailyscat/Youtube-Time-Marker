import React, { Component, Fragment } from 'react';
import { List, Button, Icon, Segment } from 'semantic-ui-react';
import { Tree } from '../index';
import './Post.css';










class Post extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            folderSettingBtnOpen: false,
            defaultSelected: "top",
            selected: "top",
            hover: false,
            folderEditList:false,
            selectedFolderId:null,
            openedFolder:["top"],
        };
    }   

    componentDidUpdate(prevProps){
        if(prevProps.currentAddThing !== this.props.currentAddThing){
            var pregFolder = document.querySelector(`[data-id="${this.props.selectedFolderId}"]`);

            if(!pregFolder.parentElement.previousElementSibling.classList.contains("open")){
                if(pregFolder.nextElementSibling){
                    pregFolder.nextElementSibling.classList.remove("none");
                    pregFolder.parentElement.previousElementSibling.classList.add("open")
                }else{
                    pregFolder.parentElement.previousElementSibling.classList.add("open")
                }
            }
            if(pregFolder.nextElementSibling && pregFolder.nextElementSibling.className !== "list none" ){
                if(pregFolder.nextElementSibling.lastElementChild){
                    var filePlacement = pregFolder.nextElementSibling.lastElementChild.getBoundingClientRect().y;
                    var scrollBottomTop = document.querySelector(".Post").scrollHeight - 328;

                    if(filePlacement < 120){
                        document.querySelector(".Post").scrollTo({
                            top: document.querySelector(".Post").scrollTop - Math.abs(filePlacement) -220,
                            behavior: "smooth"
                        });
                    }
        
                    if(filePlacement > 421){
                        document.querySelector(".Post").scrollTo({
                            top: document.querySelector(".Post").scrollTop + filePlacement - 402,
                            behavior: "smooth"
                        });
                    }
                }else{
                    return "";
                }

            }else{
                return "";
            }
        }

        
    }

    hideList (ev) {
        if(ev.target.className === "header"){
            if(ev.target.nextElementSibling){
                ev.target.nextElementSibling.classList.toggle("none");
                ev.target.parentElement.previousElementSibling.classList.toggle("open")
                
            }
        }
        this.props.selectedFolder(ev.currentTarget.dataset.id);
        if(!this.state.openedFolder.includes(ev.currentTarget.dataset.id)){
            this.setState({
                selected: ev.currentTarget.dataset.id,
                openedFolder:this.state.openedFolder.concat([ev.currentTarget.dataset.id]),
            })
        }else{
            this.setState({
                selected: ev.currentTarget.dataset.id,
            });
        }
    }

    onHover(ev){
        if(ev.currentTarget.className.includes("header")){
            ev.currentTarget.children[1].classList.remove("hidden")
        }else{
            return ""
        }
    }

    offHover(ev){

        var button = ev.currentTarget.querySelector(".ui.icon.button");
        var segments = ev.currentTarget.querySelector(".ui.compact.segments");

        if (button == ev.target) {
            button.classList.add("hidden");
            return;
        }

        button.classList.add("hidden");
        segments.classList.add("hidden");
        }


    folderEditBtn (ev){
        ev.target.nextElementSibling.classList.toggle("hidden");
    }

    addFolder (ev){
        if(ev.target.innerHTML === "Add Folder"){
            var selectedFolderId = ev.target.parentElement.parentElement.parentElement.dataset.id;
            if(!this.state.openedFolder.includes(selectedFolderId)){
                this.setState({
                    selectedFolderId:selectedFolderId,
                    openedFolder:this.state.openedFolder.concat([selectedFolderId]),
                })
            }else{
                this.setState({selectedFolderId:selectedFolderId});
            }

            this.props.addFolder(selectedFolderId);
        }
    }

    editName (ev){
        
        ev.target.parentElement.parentElement.parentElement.previousElementSibling.classList.remove("none")
        ev.target.parentElement.parentElement.parentElement.previousElementSibling.select();
        ev.target.parentElement.parentElement.parentElement.classList.add("none");
    }

    pushEnterFunction (ev) {
        if (ev.keyCode === 13) {
            this.receiveEditedName(ev.target.value, ev.target.nextElementSibling.dataset.id,ev)
        }
    }

    inputBlur (ev) {

        this.receiveEditedName(ev.target.value, ev.target.nextElementSibling.dataset.id,ev)
    }

    receiveEditedName (editedName, currentId, ev){
        this.props.receiveEditedName(editedName, currentId);
        ev.target.classList.add("none")
        ev.target.nextElementSibling.classList.remove("none");
    }

    delete (ev) {
        this.props.delete(ev.target.parentElement.parentElement.dataset.id);
        if(ev.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.className !== "default" && ev.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children.length === 1){
            ev.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.classList.remove("open")
        }
    }

    moveToUrl (ev) {
        this.props.moveToUrl(ev.currentTarget.dataset.url);
    }

    copyUrl (ev){
        ev.target.previousElementSibling.classList.remove("none");
        ev.target.previousElementSibling.select();
        document.execCommand("copy");
        ev.target.previousElementSibling.classList.add("none");
    }

    dragOver = (ev) => {
        ev.preventDefault();
        this.props.dragOver(ev);
    }

    drop = (ev) => {
        if(ev.target.parentElement.previousElementSibling.dataset.id === "top"){
            this.props.drop(ev, ev.target.dataset.id );
        }
    }

    dragLeave = (ev) => {
        this.props.dragLeave(ev);
    }

    dragEnter = (ev) => {
        this.props.dragEnter(ev);
    }
    
    render() {
        return (
            <div className="Post">
                <List >
                <List.Item className = "forExpandWidth">
                    <List.Icon name='folder open' />
                    <List.Content>
                        <input  className = "editInput none" defaultValue = {this.props.defaultFolderName} onKeyDown = {this.pushEnterFunction.bind(this)} onBlur = {this.inputBlur.bind(this)} autoFocus/> 
                        <List.Header className = "default" data-id = {"top"} onClick = {this.hideList.bind(this)} onMouseEnter = {this.onHover.bind(this)} onMouseLeave = {this.offHover.bind(this)} >
                            {this.props.defaultFolderName}
                            {this.props.selectedFolderId === this.state.defaultSelected ? <Icon color = "red" name = "check circle" size= "small" data-id = "top"/> : <Icon name = "check circle" size= "small" data-id = "top"/>}
                                <Fragment>                           
                                    <Button icon  color="white" className = "hidden" data-id = "top" > 
                                        <Icon size="small" name="ellipsis horizontal" onClick = {this.folderEditBtn.bind(this)} data-id = "top"/>
                                            <Segment.Group compact className = "hidden" >
                                                <Segment textAlign="center" onClick = {this.addFolder.bind(this)}>Add Folder</Segment>
                                                <Segment textAlign="center" onClick = {this.editName.bind(this)}>Edit Name</Segment>
                                            </Segment.Group>
                                    </Button>
                                </Fragment>
                        </List.Header>
                        <List.List onDragOver={this.dragOver.bind(this)} onDrop={this.drop.bind(this)} onDragLeave = {this.dragLeave.bind(this)} onDragEnter = {this.dragEnter.bind(this)}>
                        <Tree 
                        
                            data = {this.props.data}
                            selectedFolderId = {this.props.selectedFolderId}
                            onHover = {this.onHover.bind(this)}
                            offHover = {this.offHover.bind(this)}
                            folderEditBtn = {this.folderEditBtn.bind(this)}
                            addFolder = {this.addFolder.bind(this)}
                            editName = {this.editName.bind(this)}
                            pushEnterFunction = {this.pushEnterFunction.bind(this)}
                            inputBlur = {this.inputBlur.bind(this)}
                            delete = {this.delete.bind(this)}
                            hideList = {this.hideList.bind(this)}
                            moveToUrl = {this.moveToUrl.bind(this)}
                            copyUrl = {this.copyUrl.bind(this)}
                            currentAddThing = {this.props.currentAddThing}
                            openedFolder = {this.state.openedFolder}
                            dragStart = {this.props.dragStart.bind(this)}
                            dragOver = {this.props.dragOver.bind(this)}
                            drop = {this.props.drop.bind(this)}
                            dragLeave = {this.props.dragLeave.bind(this)}
                            dragEnter = {this.props.dragEnter.bind(this)}
                        />
                        </List.List>
                    </List.Content>  
                </List.Item>
                </List>
            </div>
        );
    }
}

export default Post;
