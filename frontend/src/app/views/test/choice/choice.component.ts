import {Component, inject, OnInit} from '@angular/core';
import {TestService} from "../../../shared/services/test.service";
import {QuizListType} from "../../../../types/quiz-list.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {TestResultType} from "../../../../types/test-result.type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {
  private testService: TestService = inject(TestService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  public quizzes: QuizListType[] = [];
  private testResults: TestResultType[] | null = null;

  ngOnInit(): void {
    this.testService.getTests()
      .subscribe((result: QuizListType[]): void => {
        this.quizzes = result;

        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          this.testService.getUserResults(userInfo.userId)
            .subscribe((result: DefaultResponseType | TestResultType[]) => {
              if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                  throw new Error((result as DefaultResponseType).message);
                }
                const testResults = result as TestResultType[]
                if (testResults) {
                  this.quizzes = this.quizzes.map(quiz => {
                    const foundItem: TestResultType | undefined = testResults.find(item => item.testId === quiz.id);
                    if (foundItem) {
                      quiz.result = foundItem.score + '/' + foundItem.total;
                    }
                    return quiz;
                  });
                }
              }
            })
        }
      });
  }

  public chooseQuiz(id: number): void {
    this.router.navigate(['/test', id]);
  }
}
