# Splitly CI/CD — Minh chứng triển khai

## Quy trình

```text
Feature branch -> Pull request -> lint/test/build -> review
-> merge main -> Render tự động deploy -> health check
```

## Đã cài đặt trong repository

| Hạng mục | Phần đã triển khai |
| --- | --- |
| CI quality gate | `.github/workflows/ci.yml` chạy khi tạo pull request hoặc push vào `main` |
| Kiểm tra API | `npm ci -> npm run lint -> npm test -> npm run build` |
| Kiểm tra Web | `npm ci -> npm run lint -> npm test -> npm run build` |
| Test tự động | 4 API tests trong `api/test/run-tests.js` và 4 Web tests trong `web/test/utils.test.js` |
| Continuous deployment | `render.yaml` dùng `autoDeployTrigger: checksPass`; API health check dùng `/v1/status` |

Kết quả kiểm tra local:

- API: lint, 4 tests và production build đều pass.
- Web: lint, 4 tests và production build đều pass.
- Nợ lint cũ vẫn được hiển thị dưới dạng warning: API có 1.918 warnings, Web có 39 warnings.

## Minh chứng cần mở cho thầy xem

1. **Pull request:** feature branch yêu cầu merge vào `main` và có một thành viên approve.
2. **GitHub Actions:** hai check `API quality` và `Web quality` đều pass.
3. **Code triển khai:** mở `.github/workflows/ci.yml`, `api/test/run-tests.js` và `web/test/utils.test.js`.
4. **Deployment:** mở Render Events sau khi CI pass, sau đó truy cập `/v1/status` và Web production.

## Ranh giới trách nhiệm

### Em — collaborator

- Tạo feature branch và pull request.
- Sửa lỗi CI và yêu cầu thành viên review.
- Trình bày workflow, test và kết quả GitHub Actions.

### Bạn — chủ GitHub/Render

- Bảo vệ `main`; bắt buộc `API quality`, `Web quality` và một approval.
- Xác nhận Render chỉ deploy sau khi CI pass.
- Mở Render Events, Settings, secrets đã che giá trị và chức năng rollback.

## Hướng dẫn dành cho bạn chủ repo

### A. Bảo vệ branch `main` trên GitHub

Thực hiện sau khi pull request đã chạy GitHub Actions ít nhất một lần:

1. Mở **Repository -> Settings -> Rules -> Rulesets**.
2. Chọn **New ruleset -> New branch ruleset**, đặt tên `Protect main` và chọn **Active**.
3. Trong **Target branches**, chọn branch mặc định hoặc nhập `main`.
4. Bật **Require a pull request before merging**, đặt **Required approvals = 1**, chặn force push và xóa branch.
5. Bật **Require status checks to pass**, thêm `API quality` và `Web quality`, sau đó lưu ruleset.

Nếu chưa thấy tên hai status checks, chờ pull request chạy CI xong rồi tải lại trang Ruleset.

### B. Kiểm tra Render

Không thay đổi secret nếu production hiện đang hoạt động:

1. Mở từng service API và Web trong Render Dashboard.
2. Vào **Settings -> Build & Deploy**, xác nhận repository và branch đều trỏ tới repo hiện tại và `main`.
3. Xác nhận **Auto Deploy** được đặt thành **After CI Checks Pass**.
4. Với API, xác nhận health check path là `/v1/status`; với Web, xác nhận production URL mở được.
5. Chỉ kiểm tra tên environment variables; không chụp hoặc gửi giá trị secret.

### C. Kiểm tra flow sau khi merge

1. Chỉ merge khi pull request có một approval và hai status checks đều xanh.
2. Mở **GitHub Actions** và xác nhận workflow trên commit `main` đã pass.
3. Mở **Render -> Events** và xác nhận API, Web bắt đầu deploy sau CI.
4. Truy cập `https://<api-host>/v1/status` và xác nhận HTTP 200.
5. Mở Web production và kiểm tra Web gọi được API.

Khi trình bày, bạn chủ repo chỉ cần mở GitHub Ruleset và Render Dashboard; em trình bày pull request, workflow và test code.

## Chưa được xem là hoàn tất trước khi merge pull request

- Branch protection cần quyền chủ repository.
- Render Settings và bằng chứng deploy cần quyền truy cập Render workspace.
- Chỉ kết luận flow hoàn tất khi Actions pass và Render deploy đúng commit đã merge.
