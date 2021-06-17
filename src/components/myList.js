import React, {useEffect, useState} from "react";
import { SkynetClient } from 'skynet-js';
import { v4 as uuidv4 } from 'uuid';
import { RiCloseCircleLine } from 'react-icons/ri';

const dataDomain = "localHost";
const dataKey = "3000";
const portal = window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
const client = new SkynetClient(portal);

function MyList() {

    //STATES FOR MYSKY, TODO LIST AND INPUT FROM USER
    const [mySky, setMySky] = useState();
    const [list, setList] = useState([]);
    const [input, setInput] = useState('');

    //STORE THE INPUT FROM THE USER ON CHANGE
    const handleChange = e => {
      setInput(e.target.value);
    };

    //FETCH JSON DATA WHICH STORES THE TODO LIST ITEMS
    const getData = async() => {
        const { data } = await mySky.getJSON(dataDomain + "/" + dataKey);
        setList(data);
    }

    const handleSubmit = async e => {
      e.preventDefault();

      //UUIDV4 RETURNS A UNIQUE ID WHICH IS USED TO INDENTIFY A TODO ITEM
      let x = { _id: uuidv4(), _text: input , isComplete: false};
      let updatedList = list;
      if(list === null) {
        updatedList = [];
        updatedList = updatedList.concat(x);
      }
      else {
        updatedList = updatedList.concat(x)
      }

      //STORE THE UPDATED LIST 
      const {data} = await mySky.setJSON(dataDomain + "/" + dataKey, updatedList );
      setList(data);

      //SET INPUT TO EMPTY IF LIST IS UPDATED
      setInput('');
    }

    //FUNCTION TO HANDLE USER LOGOUT
    const handleMySkyLogout = async () => {
      await mySky.logout();
      setList([]);
      window.location.href = '/#/';
    };

    //FUNCTION TO REMOVE A TODO LIST ITEM USING ITS _ID
    const removeTodo = async id => {
      const removedArr = list.filter(item => item._id !== id);
      const {data} = await mySky.setJSON(dataDomain + "/" + dataKey, removedArr );
      setList(data);
      console.log(list);
    };

  useEffect(() => { 
    const loadList = async () => {
        const mySky = await client.loadMySky(dataDomain);
        setMySky(mySky);
    }
    loadList();
    mySky ? getData() : <></>;
    
  }, [mySky]);

  return (
    <div className='todo-app'>
      <div><button onClick={handleMySkyLogout} className='logout-button' style={{maxWidth:80,margin:15, float:"right"}}>Log Out</button></div>
      <h1>What's the Plan for Today?</h1>
      <form onSubmit={handleSubmit} className='todo-form'>
      <input
        placeholder='Add a todo'
        value={input}
        onChange={handleChange}
        className='todo-input'
        name='text'
      />
      <button className='todo-button'>
        Add todo
      </button>
      </form>

      {list ? 
      list.map(item => (
        //ITEM LIST
        <div key={item._id} className='todo-row'>
          <div key={item.id}>
            {item._text}
          </div>
          <div className='icons'>
          <RiCloseCircleLine
            onClick={() => removeTodo(item._id)}
            className='delete-icon'
          />
          </div>
        </div>
      ))
      : <></>}
    </div>
  );
}
export default MyList;