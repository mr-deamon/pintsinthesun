import React from 'react';
import Slider from 'rc-slider';
import { Link } from 'react-router';

import ThreeD from '../../components/threed';
import WeatherIcon from '../../components/weathericon';
import Suggestion from '../../components/suggestion';
import Rational from '../../components/rational';


class PubDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    onSliderChange(value) {
        var current = this.props.date;
        this.props.updateTime(new Date(current.setHours(value)));
    }

    sliderTipFormatter(value) {
        return `${value}:00`;
    }

    launchLocationModal(e) {
        e.nativeEvent.preventDefault();
        this.props.launchLocationModal();
    }

    render() {
        if(this.props.isFetching) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Loading</p>
                        <div className="Box Box-row">
                            <p>Finding you somewhere</p>
                        </div>
                    </div>
                </div>
            )
        } else if(this.props.isLocating) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">Locating</p>
                        <div className="Box Box-row">
                            <p>Scrabbling around</p>
                        </div>
                    </div>
                </div>
            )
        } else if(!this.props.pub) {
            return (
                <div className="Screen-header">
                    <div className="max-width">
                        <p className="Heading--1">No pubs found</p>
                        <div className="Box Box-row">
                            <p>No sunny pubs found in this area. Maybe try <a onClick={this.launchLocationModal.bind(this)} href="#">looking somewhere else</a>, or a <Link to="/">different time of day</Link>?</p>
                        </div>
                    </div>
                </div>
            )
        }
        let { distance, location, name, neighbourhood } = this.props.pub;
        let [lng, lat] = location.coordinates;
        var distanceUnit = 'm';
        if (distance > 1000) {
            distance = distance / 1000;
            distanceUnit = 'Km';
        }
        return (
            <div className="Screen">

                <header className="Screen-header">
                    <div className="max-width">
                        <Suggestion name={name} />
                        <div className="Box Box-row">
                            <div className="Box-item">
                                <span>{neighbourhood ? `${neighbourhood} &mdash; ` : ''}{distance.toFixed(1)}{distanceUnit} away</span>
                            </div>
                        </div>
                        <div className="Box Box-row flex-wrap">
                            <div className="Box-item Box-item--halfCol--fixed">
                                Best for sun: 13:32-17:23
                            </div>
                            <div className="Box-item Box-item--halfCol--fixed">
                                Weather now: <WeatherIcon />
                            </div>
                        </div>
                    </div>
                </header>


                <div className="Screen-main">
                    <div className="max-width">
                        <div className="Box Box-row flex-wrap no-padding">
                            <div className="Box-item Box-item--halfCol Box-item--responsiveBorders">
                                <ThreeD
                                    centre={{lat, lng}}
                                    date={this.props.date}
                                />

                                <div className="SliderContainer">
                                    <Slider
                                        min={7}
                                        max={21}
                                        step={1}
                                        included={false}
                                        defaultValue={this.props.date.getHours()}
                                        className='Slider'
                                        onChange={this.onSliderChange.bind(this)}
                                        tipFormatter={this.sliderTipFormatter.bind(this)}
                                        marks={ {7: '7:00', 14: '14:00', 21: '21:00'} }
                                    />
                                </div>
                            </div>
                            <Rational pub={this.props.pub} />
                        </div>

                        { ( () => {
                            if(this.props.filteredPubs.length){
                                return (
                                <div className="Box Box-row no-padding">
                                    <div className="Box-item no-padding">
                                        <button className="Button--primary" onClick={this.props.incrementCurrentPub}>Show me another {this.props.filteredIndex +1}/{this.props.filteredPubs.length}</button>
                                    </div>
                                </div>
                                )
                            }
                        })() }

                    </div>
                </div>
            </div>
        )
    }
}

PubDetail.propTypes = {
    isFetching: React.PropTypes.bool.isRequired,
    isLocating: React.PropTypes.bool.isRequired,
    date: React.PropTypes.instanceOf(Date).isRequired,
    items: React.PropTypes.array,
    filteredPubs: React.PropTypes.array.isRequired,
    updateTime: React.PropTypes.func.isRequired,
    incrementCurrentPub: React.PropTypes.func,
    filteredIndex: React.PropTypes.number.isRequired,
    pub: React.PropTypes.shape({
        neighbourhoot: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    })
}

export default PubDetail;
