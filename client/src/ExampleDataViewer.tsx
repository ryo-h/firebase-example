import React from "react";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { v4 as uuidv4 } from "uuid";

type Data = {
  id: string;
  userId: string;
  fileName: string;
  data: string[];
};

type Props = {
  user: string;
};

const ExampleDataViewer: React.FC<Props> = ({ user }) => {
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
            <li key={value.fileName}>
              {value.id} {value.fileName}
              <ul>
                {value.data && (value.data.map((data, idx) => (
                  <li key={idx}>{data}</li>
                )))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <div>
        <input
          type="file"
          onChange={async e => {
            if (e.target.files?.length) {
              const fileId = uuidv4();
              const file = e.target.files[0];
              const child = storageRef.child(fileId);
              await child.put(file);
              firebase
                .firestore()
                .collection("example")
                .doc(fileId)
                .set({
                  id: fileId,
                  userId: user,
                  fileName: file.name
                });
            }
          }}
        />
      </div>
    </>
  );
};

export default ExampleDataViewer;
