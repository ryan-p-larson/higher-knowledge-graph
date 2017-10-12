import React          from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Dropdown   from '../toolbar/dropdown';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class extends React.Component {
  constructor(props) {
    super();

    this.state = {
      modalIsOpen: false,
      addCallback: props.addCallback
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillReceiveProps(props) {
    this.setState({
      dropdowns: {
        "Department": props.department_dropdown_options,
        "Major": props.major_dropdown_options,
        "Course": props.course_dropdown_options,
        "addCallback": props.addCallback
      }
    });
  }

  render() {
    return (
      <div>
        <a className="btn btn-default" title="Clear courses from chart." onClick={this.openModal}>
          <span className="glyphicon glyphicon-plus addCourseButton"></span>
        </a>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add Course Form"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Add Course</h2>
          <button onClick={this.closeModal}>close</button>

        </Modal>
      </div>
    );
  }
}