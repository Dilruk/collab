import React, { Component } from 'react';
import LeftPanel from '../components/LeftPanel.jsx';
import $ from 'jquery';

class Header extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            panel_visible: false
        };
    }

    logOut() {
        console.log('logged out');
    }

    hideLeft(event) {
        if (!$(event.target).closest('.menu').length) {
            $(document).unbind('click');                      
            this.setState({
                panel_visible: false
            }); 
        }
    }

    showLeft() {
        this.setState({
            panel_visible: true
        });
        $(document).bind('click', this.hideLeft.bind(this));    
    }


    render() {
       return (
               <div className='app-header'>
                    <nav>
                        <ul>
                            <li><span onClick={e => this.showLeft()}>Projects</span></li>
                            <li><a href="#">NUS Collab</a></li>
                            <li><a href="#"> Log Out </a></li>
                        </ul>                
                    </nav>
                        <LeftPanel visibility={this.state.panel_visible} showLeft={e => this.showLeft()} 
                            hideLeft={e => this.hideLeft()} />
               </div>
           );
    }
}

export default Header