import React from 'react';

import Slider from 'rc-slider';
import { browserHistory } from 'react-router'


class Pubs extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            index: 0
        }
    }

    componentDidMount() {
        this.props.fetchPubs(this.props.date, this.props.centre);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.items.length && !this.props.children) {
            this.context.router.push(`/pubs/0`);
            console.log('Run initial filter here perhaps');
        }
    }

    onSliderChange(value) {
        var current = this.props.date;
        this.props.updateTime(new Date(current.setHours(value)));
    }

    next(evt) {
        evt.preventDefault();
        if(this.props.items.length > 1) {
            let index = this.state.index + 1;
            if(this.state.index >= this.props.items.length -1) {
                index = 0
            }
            this.setState({index});
            this.context.router.push(`/pubs/${index}`);
        }
    }

    render() {
        if(this.props.isFetching) {
            return (
                <div className="Pub">
                    <h2>Loading</h2>
                </div>
            )
        } else if(!this.props.items.length) {
            return (
                <div className="Pub">
                    <h2>Nothing</h2>
                </div>
            )
        } else {
            let item = this.props.items[this.state.index];
            return (
                <div>
                    <p>Sunny: {this.props.filteredPubs.length}/{this.props.items.length} Nearby</p>
                    <Slider
                        min={6}
                        max={21}
                        step={1}
                        included={false}
                        defaultValue={this.props.date.getHours()}
                        className='Slider'
                        onChange={this.onSliderChange.bind(this)}
                    />
                    <div className="Panel">
                        <button className="Button" onClick={this.next.bind(this)}>Nah &rarr;</button>
                    </div>
                    {this.props.children}
                </div>
            )
        }
    }
}

Pubs.propTypes = {
    items: React.PropTypes.array,
    fetchPubs: React.PropTypes.func,
    updateTime: React.PropTypes.func,
    date: React.PropTypes.instanceOf(Date)
}

Pubs.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Pubs;

