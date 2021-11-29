import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ReactComponent as Kiyo } from "../../assets/logo.svg";

import MusicGenerator from "../generator/musicGenerator.js";
import DragDrop from "../generator/dragdrop.tsx";

import { withRouter, Link } from "react-router-dom";

const Container = styled.div`
  // width: 100%;
  width: 452px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 17px 0 64px 0;

  @media screen and (max-width: 768px) {
    margin: 20px 0 41px 0;
  }
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

const UpperDescription = styled.div`
  color: #00629e;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const TitleContainer = styled.div`
  font-size: 50px;
  font-weight: 900;
  margin-bottom: 10px;
  margin-top: 50px;
`

const SemiContainer = styled.div`
  font-size: 25px;
  font-weight: 400;
`


const MainPage = ({ history }) => {
  const [backSize, setBackSize] = useState();
  const currentUrl = window.location.href;

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
      setBackSize('100%')
  })

  return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Container>
          <>
          {backSize?
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  width: "100%",
                  backgroundSize: backSize, 
                //   background: `url(${AvatarBackground}) 0% 0% / 100% no-repeat`,
                }}
              >
                {/* <BannerContainer>
                  <AvatarBannerContainer alt="Banner" src={AvatarBanner} />
                </BannerContainer> */}
                <TitleContainer>Vocal Converter</TitleContainer>
                <SemiContainer>온라인에서 특정 멤버 파트 편집하기</SemiContainer>
                <RowContainer style={{ marginTop: "32px" }}>
                </RowContainer>
                <UpperDescription>
                  편집을 원하는 음원(mp3)을 넣으면
                  <br />
                  AI가 음성을 바꿔줄거예요!
                </UpperDescription>

                {/* <MusicGenerator /> */}
                <DragDrop />

              </div>
            </div>:<></>}
          </>
        </Container>
      </div>
  );
};

export default MainPage;
