import csv
import random

from collections import Counter
import time

class InterviewResponse:
    def __init__(self, questions):
        self.questions = questions
        self.responses = ["" for _ in range(5)]
        self.response_times = [None for _ in range(5)]
        self.filler_words_counts = [None for _ in range(5)]
        self.most_repeated_words_lists = [None for _ in range(5)]

    def record_response(self, question_index, response):
        self.responses[question_index] = response
        self.response_times[question_index] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def analyze_responses(self):
        for i, response in enumerate(self.responses):
            words = response.split()
            word_count = Counter(words)
            self.most_repeated_words_lists[i] = word_count.most_common(5)

            fillers = ["um", "uh", "like", "so"]
            self.filler_words_counts[i] = sum(word_count.get(filler, 0) for filler in fillers)

    def get_responses_data(self):
        responses_data = []
        for i in range(5):
            response_data = {
                "question": self.questions[i],
                "response_time": self.response_times[i],
                "response": self.responses[i],
                "most_repeated_words": self.most_repeated_words_lists[i],
                "filler_words_count": self.filler_words_counts[i]
            }
            responses_data.append(response_data)
        return responses_data

# Function to read questions from a CSV file
def read_questions_from_csv(file_path):
    questions = []
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            questions.append(row[0])  # Assuming questions are in the first column
    return questions

csv_file_path = "questions.csv"
all_questions = read_questions_from_csv(csv_file_path)
random.shuffle(all_questions)
selected_questions = all_questions[:5]

interview = InterviewResponse(selected_questions)

for i, question in enumerate(interview.questions):
    print(f'Question {i+1}: {question}')
    response = input("Enter your response: ")
    interview.record_response(i, response)

interview.analyze_responses()

responses_data = interview.get_responses_data()
for response_data in responses_data:
    print(response_data)
