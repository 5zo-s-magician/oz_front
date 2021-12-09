import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
  SetStateAction,
} from "react";
import "./DragDrop.scss";
import styled from "styled-components";
import { css } from "@emotion/react";
import { FaLongArrowAltRight } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`

const MemberContainer = styled.div`
  width: 140px;
  height: auto;
  padding: 20px;
  border: 1px solid black;
  padding-bottom: 5px;
  align-items: center;
`;

const MemberName = styled.div`
  margin-left: 20px;
  font-size: 15px;
  font-weight: 500;
`;

const GetMemberButton = styled.button`
  border: 0;
  width: 300px;
  height: 70px;
  background-color: #2762ff;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-top: 30px;
`;

const CheckButton = styled.button`
  border: 1px solid black;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: white;
  margin-top: 2px;
`;

const baebae = require("../../assets/baebaeFull.mp3");

interface IFileTypes {
  id: number;
  object: File;
}

const DragDrop = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);
  const [musicName, setMusicName] = useState("");

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const fileId = useRef<number>(0);
  const [audioFile, setAudioFile] = useState<string | ArrayBuffer>("");
//   const [memberList, setMemberList] = useState<String[]>([]);
const [memberList, setMemberList] = useState<any[][]>([[]]);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [voiceIndex, setVoiceIndex] = useState<number>(-1);
  const voiceList = ["Man Voice", "Woman Voice"];
  const [vcResult, setVcResult] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [vcLoading, setVcLoading] = useState(false);
  // const [getMember, setGetMember] = useState<Boolean>(false);

  useEffect(() => {
    console.log(files[0]);
    // console.log(baebae)

    function getBase64(file: File) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        if (reader.result) {
          setAudioFile(reader.result);
        }
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }

    if (files.length > 0) {
      getBase64(files[0].object);
    }

    console.log(audioFile);
  }, [files, audioFile]);

  useEffect(() => {}, [memberList]);
  useEffect(() => {

    //console.log(vcResult);
    console.log(vcResult.length);
    console.log(audioFile.toString())
  }, [vcResult]);
  useEffect(()=>{},[vcLoading])
  useEffect(()=>{},[memberLoading])

  const memberOnClick = () => {
    setMemberLoading(true)
    console.log("check")
    //console.log(audioFile.toString())
    var tmpbase64 = audioFile.toString().split('base64,')
    //console.log(tmpbase64[1])
    console.log(JSON.stringify({
      base64:tmpbase64[1].toString(),
      song_name: musicName.toString(),
    }))
    fetch(`http://localhost:5000/`, {
      mode: 'cors',
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        song_name: musicName.toString(),
        base64:tmpbase64[1].toString()
      }),
    })
    .then((res) => res.json())
    .then((data) => {
        var result = Object.keys(data).map((key) => [
            String(key), data[key]
        ])
        setMemberList(result)
        setMemberLoading(false)
    })
    .catch((err) => console.log(err));
    // api 넣기
    // setMemberList(["TOP", "GD", "태양", "승리", "대성"]);
  };

  const vcOnClick = () => {
    setVcLoading(true)
    console.log("check")
    //console.log(audioFile.toString())
    var targetName = "Man"
    var tmpbase64 = audioFile.toString().split('base64,')
    if(voiceIndex == 1){
      targetName = "Woman"
    }
    console.log( JSON.stringify({
      time: memberList[memberIndex][1],
      target: targetName.toString(),
      base64: tmpbase64[1].toString()
    }))
    fetch(`http://localhost:5000/new_song`, {
      mode: 'cors',
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        time: memberList[memberIndex][1],
        target: targetName.toString(),
        base64: tmpbase64[1].toString()
      }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        //var resulttmp = data.final_base64.toString().split("b'")
        var resulttmp = "data:audio/mpeg;base64,"+  data.final_base64.toString()
        setVcLoading(false)
        setVcResult(resulttmp)
    })
    .catch((err) => console.log(err));
  }

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      let selectFiles: File[] = [];
      let tempFiles: IFileTypes[] = files;

      if (e.type === "drop") {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }

      for (const file of selectFiles) {
        tempFiles = [
          ...tempFiles,
          {
            id: fileId.current++,
            object: file,
          },
        ];
      }

      setFiles(tempFiles);
    },
    [files]
  );

  const handleFilterFile = useCallback(
    (id: number): void => {
      setFiles(files.filter((file: IFileTypes) => file.id !== id));
    },
    [files]
  );

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          justifyItems: "center",
        }}
      >
        <div style={{ fontSize: "23px", fontWeight:900, marginTop:"25px", marginLeft:"10px"}}>음원명 :</div>
        <input
          type="member"
          name="member"
          value={musicName}
          required
          onChange={(e) => setMusicName(e.target.value)}
          style={{
            margin: "20px",
            width: "300px",
            height: "40px",
            fontSize: "22px",
            paddingLeft: "10px",
          }}
        />
      </div>
      <div className="DragDrop">
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          multiple={true}
          onChange={onChangeFiles}
        />

        <label
          className={isDragging ? "DragDrop-File-Dragging" : "DragDrop-File"}
          htmlFor="fileUpload"
          ref={dragRef}
        >
          <div style={{ fontWeight: 800 }}>파일 첨부</div>
        </label>

        <div className="DragDrop-Files">
          {files.length > 0 &&
            files.map((file: IFileTypes) => {
              const {
                id,
                object: { name },
              } = file;

              return (
                <div key={id}>
                  <div>{name}</div>
                  <div
                    className="DragDrop-Files-Filter"
                    onClick={() => handleFilterFile(id)}
                  >
                    X
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {audioFile.toString().length > 0 ? (
        <>
          <audio controls={true}>
            <source src={audioFile.toString()} />
          </audio>
          <GetMemberButton onClick={memberOnClick}>
            파트 불러오기
          </GetMemberButton>
          {memberLoading?<>
          <div style={{height:"30px"}}/>
          <ClipLoader color="#FFFFFF" loading={memberLoading} css={override}/>
          <div style={{marginTop:"20px", marginBottom:"20px"}}>
            멤버를 불러오는 중입니다...<br />
            약 10초의 시간이 소요됩니다.</div>
          </>:<></>}
        </>
      ) : (
        <></>
      )}
      {memberList.length > 0 ? (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <MemberContainer>
              {memberList.map((name, index) => (
                <div style={{ width: "100%", display: "flex", height: "50px", lineHeight:"150%" }}>
                  {index == memberIndex ? (
                    <CheckButton style={{ backgroundColor: "green" }} />
                  ) : (
                    <CheckButton
                      onClick={() => {
                        setMemberIndex(index);
                      }}
                    />
                  )}
                  <MemberName>{name[0]}</MemberName>
                </div>
              ))}
            </MemberContainer>
            <FaLongArrowAltRight style={{ fontSize: "50px" }} />
            <MemberContainer>
              {voiceList.map((name, index) => (
                <div style={{ width: "100%", display: "flex", height: "30px" }}>
                  {index == voiceIndex ? (
                    <CheckButton style={{ backgroundColor: "green" }} />
                  ) : (
                    <CheckButton
                      onClick={() => {
                        setVoiceIndex(index);
                      }}
                    />
                  )}
                  <MemberName>{name}</MemberName>
                </div>
              ))}
            </MemberContainer>
          </div>
          <GetMemberButton style={{marginBottom:"30px"}} onClick={vcOnClick}>
            voice conversion 시작
          </GetMemberButton>
          {vcLoading?<>
          <div style={{height:"30px"}}/>
          <ClipLoader color="#FFFFFF" loading={vcLoading} css={override}/>
          <div style={{marginTop:"20px", marginBottom:"20px"}}>
            목소리를 변환하는 중입니다...<br />
            약 5분에서 10분의 시간이 소요됩니다.<br/>
            잠시만 기다려주세요.</div>
          </>:<></>}
          {vcResult.length > 1000?<>
            {/*<audio controls={true}>
              <source src={audioFile.toString()} />
          </audio>*/}
          <audio controls src={vcResult.toString()}/>
          <div style={{marginTop:"20px", marginBottom:"20px"}}>
            마우스 오른쪽을 클릭하면 음원을 다운받을 수 있습니다.</div>
          </>
          :<></>}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DragDrop;
