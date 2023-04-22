import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import MyButton from "./MyButton";


const sortoptionList = [
    { value: "latest", name: "최신순" },
    { value: "oldest", name: "오래된 순" }
]

const filterOptionList = [
    { value: "all", name: "전부다" },
    { value: "good", name: "좋은 감정만" },
    { value: "bad", name: "안좋은 감정만" },
];
const ControlMenu = React.memo(({ value, onChange, optionList }) => {
    return (<select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
        {optionList.map((it, idx) => <option key={idx} value={it.value}>{it.name}</option>)}
    </select>
    );
});

const DiaryList = ({ diaryList }) => {

    const navigate = useNavigate();

    const [sortType, setSortType] = useState('latest'); // 최신순, 오래된 순 정렬위해
    const [filter, setFilter] = useState("all"); // 전부다, 좋은감정, 나쁜감정 정렬위해

    const getProcessedDiaryList = () => {

        const filterCallBack = (item) => {
            if (filter === "good") {
                return parseInt(item.emotion) <= 3;
            } else {
                return parseInt(item.emotion) > 3;
            }
        }

        const compare = (a, b) => {
            if (sortType === 'latest') {
                return parseInt(b.date) - parseInt(a.date);
            } else {
                return parseInt(a.date) - parseInt(b.date);
            }
        }

        const copyList = JSON.parse(JSON.stringify(diaryList)); // 원본 배열 지키기위해 복사배열 만들기
        const filteredList = filter === "all" ? copyList : copyList.filter((it) => filterCallBack(it)); // 감정 분류 필터
        const sortedList = filteredList.sort(compare); // 최신순, 오래된 순 정렬
        return sortedList;
    }
    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <ControlMenu
                        value={sortType}
                        onChange={setSortType}
                        optionList={sortoptionList}
                    />
                    <ControlMenu
                        value={filter}
                        onChange={setFilter}
                        optionList={filterOptionList}
                    />
                </div>
                <div className="right_col">
                    <MyButton
                        type={'positive'}
                        text={"새 일기쓰기"}
                        onClick={() => navigate('/new')}
                    />
                </div>
            </div>


            {getProcessedDiaryList().map((it) => (
                <DiaryItem key={it.id} {...it} />
            ))}
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;