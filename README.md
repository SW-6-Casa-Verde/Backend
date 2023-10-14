# Casa Verde (반려 식물 및 가드닝 도구 쇼핑몰)

### '변하지 않는 식물의 가치'를 아는 사람들을 위한 쇼핑몰

회원 가입, 장바구니 추가, 주문하기 등 쇼핑몰의 주요 서비스 및
관리자를 위한 상품, 카테고리, 주문 조회 및 수정 기능 구현

🔗 [배포링크](http://kdt-sw-6-team08.elicecoding.com/)
<br/>

## ✅ 서비스 주요 기능

### 🏷️ 회원가입

- 이메일을 통한 가입
- 다음 주소 api도입으로 간결한 주소 입력
- 회원 정보 수정 기능 가능
- <details><summary>시연 영상</summary>

  ![1회원가입](https://user-images.githubusercontent.com/104059932/211264278-a1765e81-9deb-473f-8ad8-acd70996bcaa.gif)
  </details>

### 🏷️ 로그인

- 소셜로그인 가능
- JWT 와 SessionStoragy를 사용한 로그인 정보 저장
- <details><summary>시연 영상</summary>

  ![2로그인_-비밀번호-찾기](https://user-images.githubusercontent.com/104059932/211264388-c1c40434-db53-4d57-b9bb-c56bc409dfba.gif)
  </details>

### 🏷️ 홈

- 카테고리별 Best 상품 확인 가능
- 위 nav 바의 카테고리 클릭 시 카테고리별 상품 조회 가능
- <details><summary>시연 영상</summary>

  ![3홈,검색,카테고리](https://user-images.githubusercontent.com/104059932/211264495-9ded7336-ff2b-49de-bc13-240d52d699c4.gif)

  </details>

### 🏷️ 상세페이지 / 장바구니 / 결제

- 상품 상세정보 열람
- 장바구니에 담기
- 장바구니 리스트 중 선택적으로 구매 가능
- 결제 페이지에서 쿠폰을 선택해 할인 적용
- 결제 후 가입한 이메일로 구매 내역 메일 전송
- <details><summary>시연 영상</summary>

  ![4주문_결제](https://user-images.githubusercontent.com/104059932/211264524-3d5ed53d-1632-4561-981f-c6ec5b53c908.gif)

  </details>

### 💡 관리자 - 주문, 상품, 카테고리 관리

- 주문 취소 가능
- 배송상태(배송준비중, 배송중, 배송완료) 변경 가능
  - 배송완료로 변경 후에는 수정 불가
- 상품을 추가 및 수정
  - multer를 통해 이미지 업로드
- 카테고리 추가 및 수정 가능
  <br/>

## ✅ 페이지별 화면

|                                                                                                                               |                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ![1홈](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/9c5612db-cec1-4998-8141-7e1220b97eac)                | ![2홈](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/fd7ea785-f69e-476d-8500-23dfd1124db5)                   |
| 메인 페이지(1)                                                                                                                | 메인 페이지(2)                                                                                                                   |
| ![3회원가입](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/5a8e2c03-7a2e-4676-a87e-2ae7446c441e)          | ![4로그인](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/59f39bb9-0d0b-4765-902f-51d3b84288fc)               |
| 회원가입                                                                                                                      | 로그인                                                                                                                           |
| ![5카테고리](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/8ea2c94b-731e-4e08-a45e-3fb7c92e0952)          | ![6상세페이지](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/199eae72-97f9-437c-b193-9de302710d0e)           |
| 카테고리                                                                                                                      | 상세페이지                                                                                                                       |
|                                                                                                                               |
| ![7장바구니](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/0e1f0f28-7261-412f-8948-da54c094b53d)          | ![8결제](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/f991ef53-53a3-496d-b209-7fc2f6df071f)                 |
| 장바구니                                                                                                                      | 결제                                                                                                                             |
| ![9일반회원-주문조회](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/cc7b5b4e-09e6-4f7b-8b13-9f0f6010ba20) | ![10일반회원-정보관리](https://github.com/SW-6-Casa-Verde/Casa-Verde/assets/92137309/e07070e2-ac0a-4ff4-b48e-991dc0fe2953)   |
| 일반 회원 - 주문 관리                                                                                                         | 일반 회원 - 정보 관리                                                                                                            |
                                                                                                         

### 💁🏻‍♀️ 테스트 계정

|           | 이메일         | 비밀번호   |
| --------- | -------------- | ---------- |
| 일반 회원 | test1@test.com | testtest1@ |
| 관리자    | test2@test.com | testtest2@ |

<br/>

## ✅ 기술스택

### 프론트엔드

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>

### 백엔드

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>
<img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white"/> <img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/>

<br/>
<br/>

## ✅ 기획

### 1. 정보구조도(다이어그램)

<img src="https://user-images.githubusercontent.com/104059932/211264767-84d028f1-c96b-448e-972a-ee4e32e51522.png" width="700px" />

### 2. [와이어 프레임](https://www.figma.com/file/33a0PITPQ3GaelQ2EgduNK/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=1%3A2&t=NXWFCEgiHzGDyfV3-1)

### 2. [API 명세서](https://jiwoo84.notion.site/API-a1a1b003fbda4db885bebd36d528b7d0)

<br/>

## ✅ 인프라 구조

<img src="https://i.ibb.co/9tGxmx0/image.png" width=500 />

<br/>

## ✅ 폴더 구조

- 프론트: `views` 폴더
- 백: `views`` 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br/>

## ✅ 제작자

| 이름   | 담당 업무 |
| ------ | --------- |
| 이진이 | 팀장/BE   |
| 이유진 | BE        |
| 박준석 | BE        |
| 김성재 | FE        |
| 김영준 | FE        |
| 조승준 | FE        |

<br />
