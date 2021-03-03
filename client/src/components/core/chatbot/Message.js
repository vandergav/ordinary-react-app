import React from 'react';

const Message = ({ speaks, text }) => (
  <div className="card">
    <div className="row no-gutters">
      {speaks === 'bot' && (
        <div className="col-sm-2 rounded-circle bg-warning text-center">
          <p className="card-img text-white">{speaks}</p>
        </div>
      )}
      <div className="col-sm-10">
        <div className="card-body">
          <p className="card-text">{text}</p>
        </div>
      </div>
      {speaks === 'me' && (
        <div className="col-sm-2 rounded-circle bg-info text-center">
          <p className="card-img text-white">{speaks}</p>
        </div>
      )}
    </div>
  </div>
);

export default Message;
