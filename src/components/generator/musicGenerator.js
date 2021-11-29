import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { SpinnerCircle } from "components";
import ImageUploading from "react-images-uploading";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { Receiver } from 'react-file-uploader';
// import toonify from 'toonify'

import { ReactComponent as ImageQuestion } from "../../assets/imageQuestion.svg";

const ImageBoxContainer = styled(ImageQuestion)`
  @media screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const NoticeTextContainer = styled.div`
  font-weight: normal;
  font-size: 16px;
  margin-top: 36px;
  color: white;

  @media screen and (max-width: 768px) {
    font-size: 13px;
    margin-top: 34px;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadBox = styled.div`
  width: 282px;
  height: 347px;
  margin-top: 25px;
  //   background-color: #E0E0E0;
  background: linear-gradient(#ffffff, #a5dbfa);
  color: #00629e;
  border: 1.85478px solid #00629e;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: normal;
  font-size: 2px;
  align-items: center;

  &:hover {
    opacity: 0.6;
  }

  @media screen and (max-width: 768px) {
    width: 204px;
    height: 251px;
    font-size: 14px;
  }
`;

const PopupContainer = styled.div`
  width: 274px;
  height: 135px;
  background-color: #4B4B4B;
  color: white;
  border-radius: 20px;
  text-align: center;
  padding: 25px;
  margin-left: -20px;
  margin-top: -8px;
`

const PopupText = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 3px;
`

const BackButton = styled.button`
    width: 80px;
    height: 30px;
    border-radius: 20px;
    background-color: #F761A6;
    color: white;
    border: 0;
    margin-top: 5px;
`

const MusicGenerator = () => {
  const [images, setImages] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();
  const [visible, setVisible] = useState(false);

  const history = useHistory();
  const imageRef = useRef();
  const maxNumber = 1;

  const getResult = () => {
    // const deepai = require("deepai"); // OR include deepai.min.js as a script tag in your HTML

    // deepai.setApiKey("b6fba1a0-0488-4c36-a7f6-ba7d5c5dbb09");

    // (async function geneterator() {
    //     var success = true;
    //   var resp = await deepai
    //     .callStandardApi("toonify", {
    //       image: images[0]["data_url"],
    //     })
    //     .catch(() => {
    //       setVisible(true);
    //       success = false;
    //     });

    //     if(success == true){
    //         sessionStorage.setItem("resultValue", resp.output_url); //여기에 결과 이미지를 로드!
    //         setLoading(false);
    //     }
      
    // })();
  };

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    sessionStorage.setItem("encodeUrl", imageList[0]["data_url"]);
  };

  const predict = async () => {
    // 모델 실행
    setResult(getResult());
  };

  useEffect(() => {
    if (loading === false) {
      history.push(`/results`);
      // console.log("done")
    }
  }, [loading]);

  return (
    <Container>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        id="toonify"
        className="toonify"
      >
        {({ imageList, onImageUpload, isDragging, dragProps }) => (
          // write your building UI
          <div>
            {imageList.length === 0 ? (
              <UploadBox onClick={onImageUpload} {...dragProps}>
                <ImageBoxContainer style={{ marginBottom: "13px" }} />
                {isDragging ? "여기에 올려 주세요!" : "얼굴 정면사진 첨부"}
              </UploadBox>
            ) : (
              <>
                <UploadBox onLoad={predict}>
                  {imageList.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image["data_url"]}
                        alt="face"
                        width="200px"
                        height="260px"
                        ref={imageRef}
                      />
                    </div>
                  ))}{" "}
                  <br />
                </UploadBox>
                <div
                  style={{
                    marginTop: "-70%",
                    paddingBottom: "70%",
                    marginRight: "10px",
                  }}
                >
                  <SpinnerCircle />
                </div>
              </>
            )}
          </div>
        )}
      </ImageUploading>
      <Rodal
        width={274}
        height={150}
        visible={visible}
        customStyles={{
          backgroundColor: "transparent",
          border: "0px 0px 0px 0px",
          borderRadius: "0px",
          marginTop: "200px",
          boxShadow: "0px 0px 0px 0px",
        }}
        onClose={() => {setVisible(false);history.go(0);}}
      >
          <PopupContainer>
              <PopupText>얼굴 인식에 실패했어요!</PopupText>
              <PopupText style={{display:"flex", justifyContent:"center"}}>
                  <div style={{color:"#F761A6"}}>내 사진만 나온 얼굴 정면사진</div>을</PopupText>
              <PopupText>다시 첨부해주세요.</PopupText>
            <BackButton onClick={() => {setVisible(false);history.go(0);}}>확인</BackButton>
          </PopupContainer>
      </Rodal>

      <>
        {images.length === 0 ? (
          <NoticeTextContainer>
            *사진은 어디에도 저장되지 않으니 안심하세요!
          </NoticeTextContainer>
        ) : (
          <NoticeTextContainer style={{ fontSize: "20px" }}>
            당신의 캐릭터를 만드는 중입니다...
          </NoticeTextContainer>
        )}
      </>
    </Container>
  );
};

export default MusicGenerator;
