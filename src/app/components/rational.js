import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class Rational extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rational: this.getRationalText(this.props.pub),
            intro: this.getIntroText(this.props.pub.name)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pub.name !== this.props.pub.name) {
            this.setState({
                rational: this.getRationalText(nextProps.pub),
                intro: this.getIntroText(nextProps.pub.name)
            });
        }
    }

    getIntroText(pubName) {
        return `${this.getRandomString('SUGGESTIONS')} <em>${pubName.toUpperCase()}?</em> ${this.getRandomString('VERIFICATION')}`;
    }

    getRationalText(pub) {
        var response = [];

        if(pub.has_outside_space) {
            response.push(this.getRandomString('OUTSIDE_SPACE'));
        }

        if(pub.has_garden) {
            let gardenSentence = this.getRandomString('GARDEN');
            if(pub.has_outside_space) {
                //replace the trailing ! with a comma, to allow more to be added...
                response[response.length-1] = response[response.length-1].slice(0, -1) + ', and ';
                gardenSentence = gardenSentence[0].toLowerCase() + gardenSentence.substring(1);
            }
            response.push(gardenSentence);
        }

        return response;
    }

    getWeatherStatement() {
        if(this.props.weather) {
            let weather_sentences = Rational.WEATHER_SENTENCES[this.props.weather];
            return weather_sentences[parseInt(weather_sentences.length * Math.random(), 10)];
        }
    }

    getRandomString(stringType) {
        const stringChoices = Rational[`${stringType.toUpperCase()}_SENTENCES`];
        return stringChoices[parseInt(stringChoices.length * Math.random(), 10)];
    }

    render() {
        const rational = this.state.rational.join(' ');
        const weatherStatement = this.getWeatherStatement();
        return (
            <div className="Rational Box Box-item Box-item--noPadding Box-item--halfCol Box-item--responsiveBorders">
                <div className="box-child-margin">
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: this.state.intro}}></p>
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: rational}}></p>
                    <p className="Para--large" dangerouslySetInnerHTML={{__html: weatherStatement}}></p>
                </div>
            </div>
        )
    }
};

Rational.propTypes = {
    pub: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        location: React.PropTypes.shape([
            React.PropTypes.number, React.PropTypes.number
        ]).isRequired,
        distance: React.PropTypes.number,
    }).isRequired,
    weather: React.PropTypes.oneOf([
        'CLEAR_DAY',
        'CLEAR_NIGHT',
        'PARTLY_CLOUDY_DAY',
        'PARTLY_CLOUDY_NIGHT',
        'CLOUDY',
        'RAIN',
        'SLEET',
        'SNOW',
        'WIND',
        'FOG'
    ])
};

Rational.WEATHER_SENTENCES = {
    'CLEAR_DAY': ['The <em>sun\'s</em> out! woop!', 'It\'s a lovely day'],
    'CLEAR_NIGHT': ['It\'s pretty <em>clear!</em>', 'It\'s a lovely day'],
    'PARTLY_CLOUDY_DAY': ['Might be a bit <em>cloudy</em> mind!', 'Too bad it\'s a bit <em>cloudy.</em>'],
    'PARTLY_CLOUDY_NIGHT': ['It\'ll be <em>cloudy</em> this evening.'],
    'CLOUDY': ['Doh! It\'s pretty <em>cloudy.</em>', 'Shame it\'s quite <em>cloudy</em> :(', 'Oh, it\'s <em>cloudy</em> though.'],
    'RAIN': ['Shame it\'s <em>raining!</em> though&hellip;', 'It\'s <em>raining.</em> Dammit!', 'Urgh, it\'s <em>rainy</em> though :('],
    'SLEET': ['But it\'s <em>sleeting!</em>', 'Oh - It\'s <em>wet</em> out.'],
    'SNOW': ['But it\'s <em>snowing!</em> You crazy?!'],
    'WIND': ['Watch out for the <em>wind</em> though!'],
    'FOG': ['But it\'s <em>foggy though&hellip;</em>']
};

Rational.GARDEN_SENTENCES = [
    'It\'s got a <em>garden!</em>',
    'Checkout the <em>garden!</em>',
    'There\'s a <em>garden!</em>'
];

Rational.OUTSIDE_SPACE_SENTENCES = [
    'There\'s some <em>space outside</em> here!',
    'It\'s got an area <em>outside</em>!',
    'Jackpot! There\'s some <em>outside space</em> here!'
];

Rational.SUGGESTIONS_SENTENCES = [
    'Why don\'t you head down to',
    'How about heading to',
    'What about heading to',
    'How about going to',
    'You could try heading to',
];

Rational.VERIFICATION_SENTENCES = [
    'Apparently it\'s good...',
    'It\'s been recommended before!',
    'We heard it\'s good for al fresco drinking.',
    'A great spot for a sunny pint.',
];

const mapStateToProps = (state, ownProps) => {
    const { weatherNow, isFetching } = state.weather;
    let weather = 'CLEAR_DAY';
    if(weatherNow && weatherNow.icon && !isFetching) {
        weather = weatherNow.icon.toUpperCase().replace(new RegExp('-', 'g'), '_');
    }
    return {
        weather
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const RationalContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Rational)

export default RationalContainer;
