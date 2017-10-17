import React         from 'react';
import Modal        from 'react-modal';
import {Icon}       from 'react-fa';

const customStyles = {
  content : {
    top:               '50%',
    left:               '50%',
    right:             'auto',
    bottom:         'auto',
    marginRight: '-50%',
    transform:     'translate(-50%, -50%)',
    minWidth:     '25%',
    maxWidth:    '50%',
    boxShadow:    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  }
};

export default class extends React.Component {
  render() {
    // Gather data for the popup
    let data = this.props.modalData;
    let courseID = data['id'];
    let name = data['name'];
    let department = data['department'];
    let hours = data['hours'];
    let href = data['href'];
    let description = data['description'];

    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.props.toggleModal}
          style={customStyles}
          contentLabel="View Course Details"
        >

          <div>
            <div className="row">
              <div className="col-10">
                <h4 ref={subtitle => this.subtitle = subtitle}>Course Details</h4>
              </div>
              <div className="col-2 pull-right">
                <button onClick={this.props.toggleModal}>
                  <Icon name="close"/>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p><b>Name:  </b>{name}</p>
                <p><b>Department:  </b>{department}</p>
                <p><b>CourseID:  </b>{courseID}</p>
                <p><b>Hours:  </b>{hours}</p>
                {(description !== undefined) && <p><b>Description:  </b>{description}</p>}
                <p><a target="_blank" href={href}>Link to course page</a></p>
              </div>
            </div>

          </div>
        </Modal>
      </div>
    );
  }
}
