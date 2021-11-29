import React, {
    ChangeEvent,
    useCallback,
    useRef,
    useState,
    useEffect,
    SetStateAction
  } from "react";
  import "./DragDrop.scss";
  import styled from "styled-components";
  import {FaLongArrowAltRight} from "react-icons/fa";

  const MemberContainer = styled.div`
    width: 140px;
    height: auto;
    padding: 20px;
    border: 1px solid black;
    padding-bottom: 5px;
    align-items: center;
  `

  const MemberName = styled.div`
    margin-left: 20px;
    font-size: 15px;
    font-weight: 500;
  `
  
  const GetMemberButton = styled.button`
    border: 0;
    width: 300px;
    height: 70px;
    background-color: #2762FF;
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin-top: 30px;
  `

  const CheckButton = styled.button`
    border: 1px solid black;
    width: 15px;
    height: 15px;
    border-radius: 10px;
    background-color: white;
    margin-top: 2px;
  `

  const baebae = require("../../assets/baebaeFull.mp3");
  
  interface IFileTypes {
    id: number;
    object: File;
  }
  
  const DragDrop = () => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<IFileTypes[]>([]);
  
    const dragRef = useRef<HTMLLabelElement | null>(null);
    const fileId = useRef<number>(0);
    const [audioFile, setAudioFile] = useState<string | ArrayBuffer>('');
    const [memberList, setMemberList] = useState<String[]>([]);
    const [memberIndex, setMemberIndex] = useState<Number>(-1);
    const [voiceIndex, setVoiceIndex] = useState<Number>(-1);
    const voiceList = ['Man Voice', 'Woman Voice'];
    // const [getMember, setGetMember] = useState<Boolean>(false);

    useEffect(()=>{
        console.log(files[0])
        // console.log(baebae)

        function getBase64(file: File) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if(reader.result){
                    setAudioFile(reader.result)
                }
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }

        if(files.length > 0){
            getBase64(files[0].object)
        }

        console.log(audioFile)

    },[files, audioFile])

    useEffect(()=>{

    },[memberList])

    const memberOnClick = () => {
        // api 넣기
        setMemberList(['TOP', 'GD', '태양', '승리', '대성'])
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
              object: file
            }
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
          <div style={{fontWeight:800}}>파일 첨부</div>
        </label>
  
        <div className="DragDrop-Files">
          {files.length > 0 &&
            files.map((file: IFileTypes) => {
              const {
                id,
                object: { name }
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
      {audioFile.toString().length > 0 ? <>
            <audio controls={true}>
                <source src={audioFile.toString()}/>
            </audio>
            <GetMemberButton onClick={memberOnClick}>파트 불러오기</GetMemberButton>
        </>:<></>}
        {memberList.length > 0 ? <>
        <div style={{width:"100%", display:"flex", justifyContent:"center", alignItems:"center", marginTop:"30px"}}>
            <MemberContainer>
                {memberList.map((name, index) => (
                    <div style={{width:"100%", display:"flex", height:"30px"}}>
                        {index == memberIndex ? 
                        <CheckButton style={{backgroundColor:"green"}}/>:
                        <CheckButton onClick={()=>{setMemberIndex(index)}}/>}
                        <MemberName>{name}</MemberName>
                    </div>
                ))}
            </MemberContainer>
            <FaLongArrowAltRight style={{fontSize:"50px"}}/>
            <MemberContainer>
                {voiceList.map((name, index) => (
                    <div style={{width:"100%", display:"flex", height:"30px"}}>
                        {index == voiceIndex ? 
                        <CheckButton style={{backgroundColor:"green"}}/>:
                        <CheckButton onClick={()=>{setVoiceIndex(index)}}/>}
                        <MemberName>{name}</MemberName>
                    </div>
                ))}
            </MemberContainer>
        </div>
        </>:<></>}
      </>
    );
  };
  
  export default DragDrop;