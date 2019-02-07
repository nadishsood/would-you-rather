import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { handleAnswerQuestion } from '../actions/questions'
import NavBar from './NavBar'

class Question extends Component {

    findPercentage = x => {
        const count1 = this.props.question.optionOne.votes.length
        const count2 = this.props.question.optionTwo.votes.length
        const percentage = Math.round(count1 * 100 / (count1 + count2))
        return percentage
    }

    findSelectedOption = () => {
        let optionSelected;
        if (this.props.question.optionOne.votes.find((user) => { return this.props.authedUser === user }))
            optionSelected = "optionOne"
        else optionSelected = "optionTwo"
        return optionSelected
    }
    handleOptionOneSelect = () => {
        const { dispatch, question } = this.props
        dispatch(handleAnswerQuestion(question.id, "optionOne"))
    }
    handleOptionTwoSelect = () => {
        const { dispatch, question } = this.props
        dispatch(handleAnswerQuestion(question.id, "optionTwo"))
    }
    render() {
        const { notAsked, isAnswered, question } = this.props
        if (notAsked) {
            return <ErrorPage />
        }

        return (

            <Link to={`/question/${question.id}`} >
                <div className='container'>
                    <NavBar />
                </div>
                <div className='question'>
                    <p  >
                        Would you rather
                  </p>
                    <hr />
                    <div className='question-icons'>
                        {isAnswered === true ?
                            <div className='answers'>
                                <button className={this.findSelectedOption()
                                    === "optionOne" ? "options selectedButton" : "options"}>
                                    <div>
                                        {question.optionOne.text}
                                    </div>
                                    <div>
                                        {this.findPercentage()}%
                                    </div>
                                    <div>
                                        {question.optionOne.votes.length} votes
                                    </div>
                                </button>
                                <div className='options'>Or </div>
                                <button className={this.findSelectedOption() === "optionOne" ? "options" : "options selectedButton"}>
                                    <div>
                                        {question.optionTwo.text}
                                    </div>
                                    <div>
                                        {100 - this.findPercentage()}%
                                    </div>
                                    <div>
                                        {question.optionTwo.votes.length} votes
                                    </div>
                                </button>
                            </div>
                            :
                            <div>
                                <span>
                                    <button className='a' onClick={this.handleOptionOneSelect} >
                                        {question.optionOne.text}
                                    </button>
                                </span>
                                <span className='question-icon'>OR </span>
                                <span>
                                    <button className='a' onClick={this.handleOptionTwoSelect}>
                                        {question.optionTwo.text}
                                    </button>
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </Link>
        )
    }
}

function mapStateToProps({ authedUser, users, questions }, props) {
    const { questionId } = props.computedMatch.params

    return {
        authedUser,
        users: Object.keys(users).map(key => { return users[key] }),
        isAnswered: authedUser === '' ? false : users[authedUser].answers.hasOwnProperty(questionId),
        notAsked: !questions.hasOwnProperty(questionId),
        question: questions[questionId]
    }
}
export default connect(mapStateToProps)(Question)