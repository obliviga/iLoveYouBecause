import React, { Component } from 'react';

import { db, auth } from '../firebase/firebase';
import withAuthorization from '../utils/withAuthorization';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lovedOnes: [],
      user: null,
      inputValue: '',
      inputEditValue: '',
      editMode: false,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(`${user.email}`)
        .collection('lovedOnes')
        .onSnapshot(
          call => {
            const lovedOnes = call.docs.map(doc => doc.data());
            this.setState({ lovedOnes });
          },
        );

      this.setState({ user });
    });
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && this.state.inputValue !== '') {
      this.addLovedOne();
    }
  }

  handleEditChange = (event) => {
    this.setState({ inputEditValue: event.target.value });
  }

  handleEditKeyPress = (event) => {
    // need to go into db and update value
  }

  addLovedOne = () => {
    auth.onAuthStateChanged(user => {
      const newLovedOne = db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc();

      newLovedOne.set({
        name: this.state.inputValue,
        id: newLovedOne.id,
        createdBy: this.state.user.uid,
      });

      this.setState({ inputValue: '' });
    });
  }

  removeLovedOne = lovedOne => {
    auth.onAuthStateChanged(user => {
      db
        .collection('users')
        .doc(user.email)
        .collection('lovedOnes')
        .doc(lovedOne.id)
        .delete();
    });
  }

  editLovedOne = lovedOne => {
    this.setState({
      editMode: true,
      inputEditValue: lovedOne.name,
    });
  }

  cancelEdit = lovedOne => {
    this.setState({ editMode: false });
  }

  render() {
    let lovedOnes;
    let inputValid;
    let welcomeBlurb;

    if (this.state.lovedOnes.length > 0) {
      lovedOnes = (
        this.state.lovedOnes.map((lovedOne, index) => {
          let lovedOneEdit;
          let editButton;
          let removeButton;
          let cancelButton;

          if (this.state.editMode === true) {
            console.log(index);
            lovedOneEdit = (
              <Input
                value={this.state.inputEditValue}
                placeholder="Han Solo"
                onChange={this.handleEditChange}
                onKeyPress={this.handleEditKeyPress}
              />
            );
            removeButton = (
              <Button
                onClick={() => this.removeLovedOne(lovedOne)}
                text="Remove"
              />
            );
            cancelButton = (
              <Button
                onClick={() => this.cancelEdit(lovedOne)}
                text="Cancel"
              />
            );
          } else {
            lovedOneEdit = lovedOne.name;
            editButton = (
              <Button
                onClick={() => this.editLovedOne(lovedOne)}
                text="Edit"
              />
            );
          }

          return (
            <li key={lovedOne.id}>
              {lovedOneEdit}
              {editButton}
              {removeButton}
              {cancelButton}
            </li>
          );
        })
      );

      welcomeBlurb = (
        <p>Here are your loved ones:</p>
      );
    } else {
      // this check should not be based on state,
      // need to avoid flash of content
      welcomeBlurb = (
        <p>Show some love, add loved ones!</p>
      );
    }

    if (this.state.inputValue === '') {
      inputValid = false;
    } else {
      inputValid = true;
    }

    return (
      <div>
        <Input
          value={this.state.inputValue}
          placeholder="Jyn Erso"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
        <Button
          onClick={this.addLovedOne}
          text="Add"
          disabled={!inputValid}
        />
        {welcomeBlurb}
        <ul>{lovedOnes}</ul>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
