import React from "react";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

type Data = {
  id: string;
  userId: string;
  fileId: string;
};

function ExampleDataViewer() {
  // Create a root reference
  var storageRef = firebase.storage().ref();
  const [values, loading, error] = useCollectionData<Data>(
    firebase.firestore().collection("example"),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{`Error: ${error.message}`}</div>;
  }

  return (
    <>
      {values && (
        <ul>
          {values.map(value => (
            <li key={value.fileId}>
              {value.id} {value.userId} {value.fileId}
            </li>
          ))}
        </ul>
      )}
      <div>
        <input
          type="file"
          onChange={e => {
            if (e.target.files?.length) {
              const file = e.target.files[0];
              const child = storageRef.child(`test/${file.name}`);
              child.put(file).then(function(snapshot) {
                console.log("Uploaded a blob or file!");
              });
            }
          }}
        />
      </div>
    </>
  );
}

export default ExampleDataViewer;
